using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentDto>> GetAllAsync();
        Task<DocumentDto?> GetByIdAsync(int id);
        Task<DocumentDto> CreateAsync(DocumentDto dto);
        Task<bool> UpdateAsync(int id, DocumentDto dto);
        Task<bool> DeleteAsync(int id);
    }
}