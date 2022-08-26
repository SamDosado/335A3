using A2.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
namespace A2.Data
{
    public class A2Repo : IA2Repo
    {
        private readonly A2DBContext _dbContext;

        public A2Repo(A2DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<GameRecord> GetAllGameRecords()
        {
            return _dbContext.GameRecords.ToList();
        }
        public IEnumerable<User> GetAllUsers()
        {
            return _dbContext.Users.ToList();
        }
        public GameRecord GetWaitingGameRecord()
        {
            return  _dbContext.GameRecords.FirstOrDefault(g => g.State.Equals("wait"));
        }

        public GameRecord GetGameRecord(string guid)
        {
            return _dbContext.GameRecords.FirstOrDefault(g => g.GameID.Equals(guid));
        }

        public User GetUser(string userName)
        {
            return _dbContext.Users.FirstOrDefault(u => u.UserName == userName);
        }

        public User AddUser(User user)
        {
            EntityEntry<User> e = _dbContext.Users.Add(user);
            User u = e.Entity;
            _dbContext.SaveChanges();
            return u;
        }

        public GameRecord AddGameRecord(GameRecord record)
        {
            EntityEntry<GameRecord> e = _dbContext.GameRecords.Add(record);
            GameRecord gr = e.Entity;
            _dbContext.SaveChanges();
            return gr;
        }

        public GameRecord UpdateGameRecord(GameRecord record)
        {
            EntityEntry<GameRecord> e = _dbContext.GameRecords.Update(record);
            GameRecord gr = e.Entity;
            _dbContext.SaveChanges();
            return gr;
        }

        public void DeleteGameRecord(GameRecord record)
        {
            _dbContext.GameRecords.Remove(record);
            _dbContext.SaveChanges();
        }
        
        public bool ValidLogin(string username, string password)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserName == username && e.Password == password);
            if (u == null)
            {
                return false;
            }
            return true;
        }
    }
}