using Interop.Controllers;
using Interop.Db.Abstractions;
using TodoDb;

namespace BackEnd
{
    public class MessagesController(TodoContext context, IDbSync dbSync, IObservableInvoker invoker) : IController
    {
        public IEnumerable<Message> Get()
        {
            return context.Messages;
        }

        public async Task AddRandom()
        {
            var message = new Message
            {
                Id = Guid.NewGuid(),
                Value = "Random message " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                Owner = "User" + new Random().Next(1, 100),
                To = "User" + new Random().Next(1, 100),
                Date = DateTime.Now
            };

            context.Messages.Add(message);

            await context.SaveChangesAsync();
            invoker.Notify("data updated", new List<object> { message });
            await dbSync.Sync(); //doesn't make anything but I am checking if it works
        }
    }
}
