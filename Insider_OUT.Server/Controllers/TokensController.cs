using Microsoft.AspNetCore.Mvc;
using InsiderOUT.Server.Services;
using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokensController : ControllerBase
    {
        private readonly ITokenService _service;

        public TokensController(ITokenService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var token = await _service.GetByIdAsync(id);
            return token == null ? NotFound() : Ok(token);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TokenDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.TokenId }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TokenDto dto)
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