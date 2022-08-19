using Microsoft.AspNetCore.Mvc;
using A2.Data;
using A2.Models;
using A2.Dtos;
using Microsoft.AspNetCore.HttpOverrides;
using System;
using Microsoft.EntityFrameworkCore;

namespace A2.Controllers
{
    [ApiController]
    [Route("api")]
    public class A2Controller : Controller
    {
        private readonly IA2Repo _repo;
        public A2Controller(IA2Repo repo)
        {
            _repo = repo;
        }

        [HttpPost]
        [Route("/Register")]
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




    }
}