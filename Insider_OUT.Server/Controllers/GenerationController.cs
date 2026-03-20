using Insider_OUT.Server.Data.Models.Python;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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







//namespace Insider_OUT.Server.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class GenerationController : ControllerBase
//    {
//        private readonly PythonService _python;

//        public GenerationController(PythonService python)
//        {
//            _python = python;
//        }

//        [HttpPost("generate")]
//        public async Task<IActionResult> GenerateDocument([FromBody] GeneratePreviewRequest request)
//        {
//            var contentResult = await _python.GenerateContentAsync(request);

//            var pdfRequest = new PreviewPdfRequest
//            {
//                Content = contentResult.Content,
//                Header = contentResult.Header,
//                FileName = contentResult.FileName //this is a .docx file ext. We should not be using it in the pdf gen. 
//            };

//            var pdfResult = await _python.PreviewPdfAsync(pdfRequest);


//            var trackingResult = await _python.CreateTrackingImageAsync();

//            var canaryRequest = new InjectCanaryRequest
//            {
//                Content = contentResult.Content,
//                Header = contentResult.Header,
//                FileName = contentResult.FileName,
//                TokenId = trackingResult.TokenId
//            };

//            var canaryResult = await _python.InjectCanaryAsync(canaryRequest);

//            return Ok(new
//            {
//                content = contentResult,
//                tracking = trackingResult,
//                pdf = pdfResult,
//                canary = pdfResult
//            });
//        }
//    }

//}
