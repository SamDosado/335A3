using Microsoft.EntityFrameworkCore;
using A2.Models;

namespace A2.Data
{
    public class A2DBContext : DbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<GameRecord> GameRecords { get; set; }
    }
}