using InsiderOUT.Server.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public interface ISubjectService
    {
        Task<IEnumerable<SubjectDto>> GetAllAsync();
        Task<SubjectDto?> GetByIdAsync(int id);
        Task<SubjectDto> CreateAsync(SubjectDto dto);
        Task<bool> UpdateAsync(int id, SubjectDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
