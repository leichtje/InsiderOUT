using Microsoft.AspNetCore.Mvc;
using InsiderOUT.Server.Services;
using InsiderOUT.Server.Models.Dto;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidentsController : ControllerBase
    {
        private readonly IIncidentService _service;

        public IncidentsController(IIncidentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var incident = await _service.GetByIdAsync(id);
            return incident == null ? NotFound() : Ok(incident);
        }

        [HttpGet("{id:int}/view")]
        public async Task<IActionResult> GetViewById(int id)
        {
            var view = await _service.GetViewByIdAsync(id);
            return view == null ? NotFound() : Ok(view);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IncidentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.IncidentId },
                created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] IncidentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var ok = await _service.UpdateAsync(id, dto);
            return ok ? NoContent() : NotFound();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
