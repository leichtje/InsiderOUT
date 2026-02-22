using Microsoft.AspNetCore.Mvc;
using InsiderOUT.Server.Services;
using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _service;

        public ActivitiesController(IActivityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var activity = await _service.GetByIdAsync(id);
            return activity == null ? NotFound() : Ok(activity);
        }

        [HttpGet("entity/{entityType}/{entityId:int}")]
        public async Task<IActionResult> GetByEntity(string entityType, int entityId)
            => Ok(await _service.GetByEntityAsync(entityId, entityType));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ActivityDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.ActivityId },
                created);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}

