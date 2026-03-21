using System.Text.Json.Serialization;

namespace Insider_OUT.Server.Data.Models.Python
{
    public class FinalizeResponse
    {
        [JsonPropertyName("fileName")]
        public string FinalName { get; set; }
    }
}
