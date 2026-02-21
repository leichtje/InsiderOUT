using Microsoft.AspNetCore.Mvc;
using InsiderOUT.Server.Services;
using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _service;

        public DocumentsController(IDocumentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{documentId:int}")]
        public async Task<IActionResult> GetById(int documentId)
        {
            var doc = await _service.GetByIdAsync(documentId);
            return doc == null ? NotFound() : Ok(doc);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DocumentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { documentId = created.DocumentId },
                created);
        }

        [HttpPut("{documentId:int}")]
        public async Task<IActionResult> Update(int documentId, [FromBody] DocumentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var ok = await _service.UpdateAsync(documentId, dto);
            return ok ? NoContent() : NotFound();
        }

        [HttpDelete("{documentId:int}")]
        public async Task<IActionResult> Delete(int documentId)
        {
            var ok = await _service.DeleteAsync(documentId);
            return ok ? NoContent() : NotFound();
        }
    }
}