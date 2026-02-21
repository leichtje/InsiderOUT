using InsiderOUT.Server.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public interface ITokenService
    {
        Task<IEnumerable<TokenDto>> GetAllAsync();
        Task<TokenDto?> GetByIdAsync(int id);
        Task<TokenDto> CreateAsync(TokenDto dto);
        Task<bool> UpdateAsync(int id, TokenDto dto);
        Task<bool> DeleteAsync(int id);
    }
}