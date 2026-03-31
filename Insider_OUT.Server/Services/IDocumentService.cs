using InsiderOUT.Server.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentDto>> GetAllAsync();
        Task<DocumentDto?> GetByIdAsync(Guid id);
        Task<DocumentDto> CreateAsync(DocumentDto dto);
        Task<bool> UpdateAsync(Guid id, DocumentDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}