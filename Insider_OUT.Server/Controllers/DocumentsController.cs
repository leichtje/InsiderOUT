using Microsoft.AspNetCore.Mvc;
using InsiderOUT.Server.Services;
using InsiderOUT.Server.Models.Dto;
using System;
using System.Threading.Tasks;

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
        {
            var docs = await _service.GetAllAsync();
            return Ok(docs);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var doc = await _service.GetByIdAsync(id);

            if (doc == null)
                return NotFound();

            return Ok(new
            {
                documentId = doc.DocumentId,
                tokenId = doc.TokenId.ToString(),
                name = doc.DocumentName,
                location = doc.DocumentLocation,
                created = doc.CreatedDate,
                updated = doc.UpdatedDate,
                department = doc.DocumentDepartment,
                content = doc.DocumentContent,
                header = doc.DocumentHeader,
                filepath = doc.DocumentFilepath
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DocumentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);

            return CreatedAtAction(nameof(GetById),
                new { id = created.TokenId },
                new
                {
                    documentId = created.DocumentId,
                    tokenId = created.TokenId.ToString(),
                    name = created.DocumentName
                });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DocumentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, dto);

            if (updated == null)
                return NotFound();

            return Ok(new
            {
                documentId = updated.DocumentId,
                tokenId = updated.TokenId.ToString(),
                name = updated.DocumentName
            });
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ok = await _service.DeleteAsync(id);

            if (!ok)
                return NotFound();

            return NoContent();
        }
    }
}
