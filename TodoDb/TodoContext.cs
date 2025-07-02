using Interop.Db.Abstractions.Context;
using Microsoft.EntityFrameworkCore;

namespace TodoDb
{
    public class TodoContext : DbSyncContext
    {
        public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
        {
        }

        public DbSet<Message> Messages { get; set; }
    }
}
