using InsiderOUT.Server.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public interface IIncidentService
    {
        Task<IEnumerable<IncidentDto>> GetAllAsync();
        Task<IncidentDto?> GetByIdAsync(int id);
        Task<IncidentViewDto?> GetViewByIdAsync(int id);
        Task<IncidentDto> CreateAsync(IncidentDto dto);
        Task<bool> UpdateAsync(int id, IncidentDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
