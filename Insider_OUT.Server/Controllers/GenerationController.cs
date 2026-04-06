using Insider_OUT.Server.Data.Models.Python;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using InsiderOUT.Server.Services;
using Insider_OUT.Server.Services;

namespace InsiderOUT.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenerationController : ControllerBase
    {
        private readonly PythonService _python;

        public GenerationController(PythonService python)
        {
            _python = python;
        }

        [HttpPost("generate-preview")]
        public async Task<IActionResult> GeneratePreview([FromBody] GeneratePreviewRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var preview = await _python.GeneratePreviewAsync(request);
            return Ok(preview);
        }

        [HttpPost("finalize")]
        public async Task<IActionResult> FinalizeDocument([FromBody] FinalizeRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _python.FinalizeDocumentAsync(request);
            return Ok(result);
        }
    }
}
