using InsiderOUT.Server.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(UserDto dto);
        Task<bool> UpdateAsync(int id, UserDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
