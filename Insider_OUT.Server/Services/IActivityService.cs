using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public interface IActivityService
    {
        Task<IEnumerable<ActivityDto>> GetAllAsync();
        Task<ActivityDto?> GetByIdAsync(int id);
        Task<IEnumerable<ActivityDto>> GetByEntityAsync(int entityId, string entityType);
        Task<ActivityDto> CreateAsync(ActivityDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
