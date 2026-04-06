using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public interface ITokenService
    {
        Task<IEnumerable<TokenDto>> GetAllAsync();
        Task<TokenDto?> GetByIdAsync(Guid id);
        Task<TokenDto> CreateAsync(TokenDto dto);
        Task<TokenDto?> UpdateAsync(Guid id, TokenDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}