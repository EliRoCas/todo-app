using Interop.Db.Abstractions;
using Interop.Maui;
using Microsoft.EntityFrameworkCore;
using Telegram.API;
using TodoDb;

namespace BackEnd
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

            builder.Services
                .AddInteropHybrid()
                .UseInterop(async (context, next) =>
                {
                    try
                    {
                        await next(context);
                    }
                    catch (Exception ex)
                    {
                        Shell.Current.CurrentPage.DisplayAlert("Error", ex.Message, "OK");
                    }
                })
                .UseInteropDefaults(typeof(MessagesController).Assembly);

            string dbPath = Path.Combine(FileSystem.AppDataDirectory, "mydatabase.db");
            string sessionPath = Path.Combine(FileSystem.AppDataDirectory, "tg.session");

            builder.Services.AddDbContext<TodoContext>(options =>
            {
                options.UseSqlite($"Filename={dbPath}");
            });


            builder.Services.AddTelegramApi<TodoContext>(new TelegramOptions()
            {
                ConfigProvider = (what) =>
                {
                    switch (what)
                    {
                        case "session_pathname": return sessionPath;
                        case "api_id": return "27022097";
                        case "api_hash": return "13121228f93951afd95c1cb49b803e56";
                        case "phone_number": return "+573124330119";
                        case "verification_code": return MainThread.InvokeOnMainThreadAsync(async () => await Shell.Current.DisplayPromptAsync("Code", "Tg code")).GetAwaiter().GetResult();
                        case "password": return "";
                        case "chat_name": return "Todo-ea";
                        default: return null;
                    }
                },
                SyncCron = TimeSpan.FromSeconds(30)
            });




            var app = builder.Build();


            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<TodoContext>();
                context.Database.EnsureCreated();

                var observable = scope.ServiceProvider.GetRequiredService<IObservableInvoker>();



                scope.ServiceProvider.GetRequiredService<ISyncChanges>().OnChangesSync += (changes) =>
                {
                    foreach (var change in changes)
                    {
                        observable.Notify("data updated", change);
                    }

                };

                var dbSync = scope.ServiceProvider.GetRequiredService<IDbSync>();
                dbSync.Start();
            }

            return app;
        }
    }
}
