using Insider_OUT.Server.Data.Models.Tokens;
using Insider_OUT.Server.Data;
using Insider_OUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace Insider_OUT.Server.Services
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

                    TokenId = d.Token.TokenId,          // GUID now
                    TokenType = d.Token.TokenType,
                    TokenSeverity = d.Token.TokenSeverity,

                    CreatedDate = d.Token.CreatedDate,
                    UpdatedDate = d.Token.UpdatedDate,

                    DocumentDepartment = d.DocumentDepartment,
                    DocumentContent = d.DocumentContent,
                    DocumentHeader = d.DocumentHeader,
                    DocumentFilepath = d.DocumentFilepath
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

                TokenId = d.Token.TokenId,          // GUID now
                TokenType = d.Token.TokenType,
                TokenSeverity = d.Token.TokenSeverity,

                CreatedDate = d.Token.CreatedDate,
                UpdatedDate = d.Token.UpdatedDate,

                DocumentDepartment = d.DocumentDepartment,
                DocumentContent = d.DocumentContent,
                DocumentHeader = d.DocumentHeader,
                DocumentFilepath = d.DocumentFilepath
            };
        }

        public async Task<DocumentDto> CreateAsync(DocumentDto dto)
        {
            // Create Token with GUID
            var token = new Token
            {
                TokenId = Guid.NewGuid(),           // NEW GUID
                TokenType = "document",
                TokenSeverity = dto.TokenSeverity ?? "Low",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _db.Tokens.Add(token);
            await _db.SaveChangesAsync();

            // Create Document linked to Token
            var entity = new Document
            {
                DocumentName = dto.DocumentName,
                DocumentLocation = dto.DocumentLocation,
                DocumentTokenId = token.TokenId,    // GUID FK

                DocumentDepartment = dto.DocumentDepartment,
                DocumentContent = dto.DocumentContent,
                DocumentHeader = dto.DocumentHeader,
                DocumentFilepath = dto.DocumentFilepath
            };

            _db.Documents.Add(entity);
            await _db.SaveChangesAsync();

            // Reload with Token included
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
                UpdatedDate = created.Token.UpdatedDate,

                DocumentDepartment = created.DocumentDepartment,
                DocumentContent = created.DocumentContent,
                DocumentHeader = created.DocumentHeader,
                DocumentFilepath = created.DocumentFilepath
            };
        }

        public async Task<bool> UpdateAsync(int id, DocumentDto dto)
        {
            var entity = await _db.Documents.FindAsync(id);
            if (entity == null) return false;

            entity.DocumentName = dto.DocumentName;
            entity.DocumentLocation = dto.DocumentLocation;

            entity.DocumentDepartment = dto.DocumentDepartment;
            entity.DocumentContent = dto.DocumentContent;
            entity.DocumentHeader = dto.DocumentHeader;
            entity.DocumentFilepath = dto.DocumentFilepath;

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
