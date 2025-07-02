using Interop.Db.Abstractions;

namespace TodoDb
{
    public class Message : IDbSyncEntity
    {
        public Guid Id { get; set; }
        public string Value { get; set; }
        public string Owner { get; set; }
        public string To { get; set; }
        public DateTime Date { get; set; }
    }
}
