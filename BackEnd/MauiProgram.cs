using Interop.Maui;

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
                .UseInteropDefaults(typeof(WeatherForecastController).Assembly);

            var app = builder.Build();


            using (var scope = app.Services.CreateScope())
            {
                var invoker = scope.ServiceProvider.GetRequiredService<IObservableInvoker>();

                Task.Run(async () =>
                {
                    while (true)
                    {
                        invoker.Notify("task 1", DateTime.Now);
                        await Task.Delay(10000);
                    }
                });

            }

            return app;
        }
    }
}
