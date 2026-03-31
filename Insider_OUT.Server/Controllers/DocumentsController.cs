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
            => Ok(await _service.GetAllAsync());

        //CHANGED: id:int → id:guid
        //CHANGED: parameter type int → Guid
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var doc = await _service.GetByIdAsync(id);

            if (doc == null)
                return NotFound();

            //CHANGED: return TokenId (Guid) from your DTO
            return Ok(new
            {
                documentId = doc.DocumentId,
                tokenId = doc.TokenId.ToString(),   //CHANGED
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

            //CHANGED: CreatedAtAction now uses GUID TokenId
            return CreatedAtAction(nameof(GetById),
                new { id = created.TokenId }, 
                new
                {
                    documentId = created.DocumentId,
                    tokenId = created.TokenId.ToString(),   //CHANGED
                    name = created.DocumentName
                });
        }

        // CHANGED: id:int → id:guid
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DocumentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, dto);  

            return updated == null ? NotFound() : Ok(new
            {
                documentId = updated.DocumentId,
                tokenId = updated.TokenId.ToString(),
                name = updated.DocumentName
            });
        }

        // CHANGED: id:int → id:guid
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ok = await _service.DeleteAsync(id);   

            return ok ? NoContent() : NotFound();
        }
    }
}
