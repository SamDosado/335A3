using Microsoft.AspNetCore.Mvc;
using A2.Data;
using A2.Models;
using A2.Dtos;
using Microsoft.AspNetCore.HttpOverrides;
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace A2.Controllers
{
    [Route("api")]
    [ApiController]
    public class A2Controller : Controller
    {
        private readonly IA2Repo _repo;
        public A2Controller(IA2Repo repo)
        {
            _repo = repo;
        }

        
        [HttpPost]
        [Route("Register")]
        public ActionResult<String> Register(User user)
        {
            try
            {
                _repo.AddUser(user);
            }
            catch (DbUpdateException e)
            {
                return Ok("Username not available.");
            }
                
            return Ok("User successfully registered.");
        }

        [Authorize(AuthenticationSchemes = "A2Authentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet]
        [Route("GetVersionA")]
        public ActionResult<String> GetVersionAuth()
        {
            
            //Response.Headers.Add(); www-authenticate already set in auth handler? idk what man means
            return Ok("1.0.0 (auth)");
        }

        [Authorize(AuthenticationSchemes = "A2Authentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost]
        [Route("PurchaseItem/{id}")]
        public ActionResult<Order> PurchaseItem(int id)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string UserName = c.Value;
            //User user = _repo.GetUser(userName);
            Order order = new Order() { productId = id, userName = UserName };
            return Ok(order);
        }

        [Authorize(AuthenticationSchemes = "A2Authentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet]
        [Route("PairMe")]
        public ActionResult<GameRecordOut> PairUser()
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string UserName = c.Value;
            GameRecord record = _repo.GetWaitingGameRecord();
            if (record == null)
            {
                record = new GameRecord()
                {
                    GameID = System.Guid.NewGuid().ToString(),
                    Player1 = UserName,
                    State = "wait"
                };
                _repo.AddGameRecord(record);
            } 
            else
            {
                if (!record.Player1.Equals(UserName))
                {
                    record.Player2 = UserName;
                    record.State = "progress";
                    _repo.UpdateGameRecord(record);
                }
                
            }
            GameRecordOut gro = new GameRecordOut() 
            {
                GameID =record.GameID,
                State=record.State,
                Player1 = record.Player1,
                Player2 = record.Player2
            };
            return gro;
        }

        [Authorize(AuthenticationSchemes = "A2Authentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet]
        [Route("TheirMove{GUID}")]
        public ActionResult<string> GetOpponentMove(string guid)
        {
            GameRecord record = _repo.GetGameRecord(guid);
            if (record == null)
            {
                return Ok("no such gameId.");
            }
            if (record.State.Equals("wait"))
            {
                return Ok("You do not have an opponent yet.");
            }
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string UserName = c.Value;
            if (record.Player1.Equals(UserName) || record.Player2.Equals(UserName))
            {

                if (record.Player1.Equals(UserName))
                {
                    var move = record.LastMovePlayer2;
                    if (move == null)
                    {
                        return Ok("Your opponent has not moved yet.");
                    }
                    return Ok(record.LastMovePlayer2);
                }
                var move1 = record.LastMovePlayer1;
                if (move1 == null)
                {
                    return Ok("Your opponent has not moved yet.");
                }
                return Ok(record.LastMovePlayer1);
            }
            else
            {
                return Ok("not your game id.");
            }
        }


        [Authorize(AuthenticationSchemes = "A2Authentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost]
        [Route("MyMove")]
        public ActionResult<string> MakeMove(GameMove move)
        {
            GameRecord record = _repo.GetGameRecord(move.Id);
            if (record == null)
            {
                return Ok("no such gameId.");
            }
            else if (record.State.Equals("wait"))
            {
                return Ok("You do not have an opponent yet.");
            }
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string UserName = c.Value;
            if (record.Player1.Equals(UserName))
            {
                if (record.LastMovePlayer1 != null)
                {
                    return Ok("Your opponent has not moved yet.");
                }
                
                //return Ok(record.LastMovePlayer2);
                record.LastMovePlayer1 = move.postion;
                record.LastMovePlayer2 = null;
                _repo.UpdateGameRecord(record);
                return Ok("move registered");
            }
            else if (record.Player2.Equals(UserName))
            {
               if (record.LastMovePlayer2 != null)
               {
                    return Ok("Your opponent has not moved yet.");
               }
                record.LastMovePlayer2 = move.postion;
                record.LastMovePlayer1 = null;
                _repo.UpdateGameRecord(record);
                return Ok("move registered");
            }
            else
            {
                return Ok("not your game id.");
            }
        }


        [Authorize(AuthenticationSchemes = "A2Authentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet]
        [Route("QuitGame/{GUID}")]
        public ActionResult<string> QuitGame(string guid)
        {
            GameRecord record = _repo.GetGameRecord(guid);
            if (record == null)
            {
                return Ok("no such gameId.");
            }
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string UserName = c.Value;
            if (record.Player1.Equals(UserName) || record.Player2.Equals(UserName))
            {
                if (record.State.Equals("wait"))
                {
                    return Ok("You have not started a game");
                }
                _repo.DeleteGameRecord(record);
                return Ok("game over");
            } 
            else
            {
                return Ok("not your game id.");
            }
        }


        

    }
}