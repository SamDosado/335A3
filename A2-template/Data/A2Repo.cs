using A2.Models;

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
            throw new NotImplementedException();
        }
        public IEnumerable<User> GetAllUsers()
        {
            throw new NotImplementedException();
        }
        public GameRecord GetGameRecord()
        {
            throw new NotImplementedException();
        }

    }