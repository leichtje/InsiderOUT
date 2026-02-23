using Insider_OUT.Server.Data.Models.Tokens;
using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace InsiderOUT.Server.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly DBContext _db;

        public DocumentService(DBContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<DocumentDto>> GetAllAsync()
        {
            return await _db.Documents
                .AsNoTracking()
                .Include(d => d.Token)
                .Select(d => new DocumentDto
                {
                    DocumentId = d.DocumentId,
                    DocumentName = d.DocumentName,
                    DocumentLocation = d.DocumentLocation,

                    TokenId = d.Token.TokenId,
                    TokenType = d.Token.TokenType,
                    TokenSeverity = d.Token.TokenSeverity,

                    CreatedDate = d.Token.CreatedDate,
                    UpdatedDate = d.Token.UpdatedDate
                })
                .ToListAsync();
        }

        public async Task<DocumentDto?> GetByIdAsync(int id)
        {
            var d = await _db.Documents
                .AsNoTracking()
                .Include(x => x.Token)
                .FirstOrDefaultAsync(x => x.DocumentId == id);

            if (d == null) return null;

            return new DocumentDto
            {
                DocumentId = d.DocumentId,
                DocumentName = d.DocumentName,
                DocumentLocation = d.DocumentLocation,

                TokenId = d.Token.TokenId,
                TokenType = d.Token.TokenType,
                TokenSeverity = d.Token.TokenSeverity,

                CreatedDate = d.Token.CreatedDate,
                UpdatedDate = d.Token.UpdatedDate
            };
        }

        public async Task<DocumentDto> CreateAsync(DocumentDto dto)
        {
            // We trust frontend to send a valid TokenId; FK enforces correctness.
            var entity = new Document
            {
                DocumentName = dto.DocumentName,
                DocumentLocation = dto.DocumentLocation,
                DocumentTokenId = dto.TokenId
            };

            _db.Documents.Add(entity);
            await _db.SaveChangesAsync();

            // Reload with token to populate dates and token info
            var created = await _db.Documents
                .AsNoTracking()
                .Include(d => d.Token)
                .FirstAsync(d => d.DocumentId == entity.DocumentId);

            return new DocumentDto
            {
                DocumentId = created.DocumentId,
                DocumentName = created.DocumentName,
                DocumentLocation = created.DocumentLocation,

                TokenId = created.Token.TokenId,
                TokenType = created.Token.TokenType,
                TokenSeverity = created.Token.TokenSeverity,

                CreatedDate = created.Token.CreatedDate,
                UpdatedDate = created.Token.UpdatedDate
            };
        }

        public async Task<bool> UpdateAsync(int id, DocumentDto dto)
        {
            var entity = await _db.Documents.FindAsync(id);
            if (entity == null) return false;

            entity.DocumentName = dto.DocumentName;
            entity.DocumentLocation = dto.DocumentLocation;
            entity.DocumentTokenId = dto.TokenId;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _db.Documents.FindAsync(id);
            if (entity == null) return false;

            _db.Documents.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}