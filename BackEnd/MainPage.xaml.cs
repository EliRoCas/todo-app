namespace BackEnd
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();

#if DEBUG
            webView.Source = "http://localhost:4200/";
#endif
        }
    }
}
