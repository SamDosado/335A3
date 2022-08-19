using A2.Models;

namespace A2.Data
{
    public interface IA2Repo
    {
        public IEnumerable<GameRecord> GetAllGameRecords();
        public IEnumerable<User> GetAllUsers();
        public GameRecord GetGameRecord();
        public User AddUser(User user);
        public GameRecord AddGameRecord(GameRecord record);
        public bool ValidLogin(string username, string password);
    }
}