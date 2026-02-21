using InsiderOUT.Server.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentDto>> GetAllAsync();
        Task<DocumentDto?> GetByIdAsync(int documentId);
        Task<DocumentDto> CreateAsync(DocumentDto dto);
        Task<bool> UpdateAsync(int documentId, DocumentDto dto);
        Task<bool> DeleteAsync(int documentId);
    }
}