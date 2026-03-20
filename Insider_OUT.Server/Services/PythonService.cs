using Insider_OUT.Server.Data.Models.Python;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Insider_OUT.Server.Services
{
    public class PythonService
    {
        private readonly HttpClient _http;

        public PythonService(HttpClient http)
        {
            _http = http;
            _http.BaseAddress = new Uri("http://localhost:5050/");
        }

        public async Task<GenerateContentResponse> GenerateContentAsync(GenerateContentRequest request)
        {
            var response = await _http.PostAsJsonAsync("generate-content", request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<GenerateContentResponse>();
        }

        public async Task<TrackingImageResponse> CreateTrackingImageAsync()
        {
            var response = await _http.PostAsync("create-tracking-image", null);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<TrackingImageResponse>();
        }

        public async Task<PreviewPdfResponse> PreviewPdfAsync(PreviewPdfRequest request)
        {
            var response = await _http.PostAsJsonAsync("preview-pdf", request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<PreviewPdfResponse>();
        }

        public async Task<InjectCanaryResponse> InjectCanaryAsync(InjectCanaryRequest request)
        {
            var response = await _http.PostAsJsonAsync("inject-canary", request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<InjectCanaryResponse>();
        }
    }
}
