using Microsoft.AspNetCore.Mvc;
using InsiderOUT.Server.Services;
using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _service;

        public DepartmentsController(IDepartmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dept = await _service.GetByIdAsync(id);
            return dept == null ? NotFound() : Ok(dept);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.DepartmentId },
                created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DepartmentDto dto)
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