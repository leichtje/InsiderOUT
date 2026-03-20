namespace Insider_OUT.Server.Data.Models.Python
{
    public class GenerateContentRequest
    {
        public string ShortDescription { get; set; }
        public string TargetAudience { get; set; }
        public string SeverityLevel { get; set; }
        public List<string> Departments { get; set; }
    }
}
