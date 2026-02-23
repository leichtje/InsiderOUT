using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public interface ITokenService
    {
        Task<IEnumerable<TokenDto>> GetAllAsync();
        Task<TokenDto?> GetByIdAsync(int id);
        Task<TokenDto> CreateAsync(TokenDto dto);
        Task<TokenDto?> UpdateAsync(int id, TokenDto dto);
        Task<bool> DeleteAsync(int id);
    }
}