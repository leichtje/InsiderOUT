using Insider_OUT.Server.Data.Models.Tokens;
using Microsoft.EntityFrameworkCore;
using InsiderOUT.Server.Models.Dto;
using InsiderOUT.Server.Data;

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
                    UpdatedDate = d.Token.UpdatedDate,

                    DocumentDepartment = d.DocumentDepartment,
                    DocumentContent = d.DocumentContent,
                    DocumentHeader = d.DocumentHeader,
                    DocumentFilepath = d.DocumentFilepath
                })
                .ToListAsync();
        }

        public async Task<DocumentDto?> GetByIdAsync(Guid id)
        {
            var d = await _db.Documents
                .AsNoTracking()
                .Include(x => x.Token)
                .FirstOrDefaultAsync(x => x.DocumentTokenId == id);

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
                UpdatedDate = d.Token.UpdatedDate,

                DocumentDepartment = d.DocumentDepartment,
                DocumentContent = d.DocumentContent,
                DocumentHeader = d.DocumentHeader,
                DocumentFilepath = d.DocumentFilepath
            };
        }

        public async Task<DocumentDto> CreateAsync(DocumentDto dto)
        {
            var token = new Token
            {
                TokenId = Guid.NewGuid(),
                TokenType = "document",
                TokenSeverity = dto.TokenSeverity ?? "Low",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _db.Tokens.Add(token);
            await _db.SaveChangesAsync();

            var entity = new Document
            {
                DocumentName = dto.DocumentName,
                DocumentLocation = dto.DocumentLocation,
                DocumentTokenId = token.TokenId,

                DocumentDepartment = dto.DocumentDepartment,
                DocumentContent = dto.DocumentContent,
                DocumentHeader = dto.DocumentHeader,
                DocumentFilepath = dto.DocumentFilepath
            };

            _db.Documents.Add(entity);
            await _db.SaveChangesAsync();

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

        public async Task<DocumentDto?> UpdateAsync(Guid id, DocumentDto dto)
        {
            var entity = await _db.Documents
                .Include(x => x.Token)
                .FirstOrDefaultAsync(x => x.DocumentTokenId == id);

            if (entity == null)
                return null;

            entity.DocumentName = dto.DocumentName;
            entity.DocumentLocation = dto.DocumentLocation;

            entity.DocumentDepartment = dto.DocumentDepartment;
            entity.DocumentContent = dto.DocumentContent;
            entity.DocumentHeader = dto.DocumentHeader;
            entity.DocumentFilepath = dto.DocumentFilepath;

            entity.Token.TokenSeverity = dto.TokenSeverity ?? entity.Token.TokenSeverity;
            entity.Token.UpdatedDate = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return new DocumentDto
            {
                DocumentId = entity.DocumentId,
                DocumentName = entity.DocumentName,
                DocumentLocation = entity.DocumentLocation,

                TokenId = entity.Token.TokenId,
                TokenType = entity.Token.TokenType,
                TokenSeverity = entity.Token.TokenSeverity,

                CreatedDate = entity.Token.CreatedDate,
                UpdatedDate = entity.Token.UpdatedDate,

                DocumentDepartment = entity.DocumentDepartment,
                DocumentContent = entity.DocumentContent,
                DocumentHeader = entity.DocumentHeader,
                DocumentFilepath = entity.DocumentFilepath
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _db.Documents
                .FirstOrDefaultAsync(x => x.DocumentTokenId == id);

            if (entity == null)
                return false;

            _db.Documents.Remove(entity);
            await _db.SaveChangesAsync();

            return true;
        }
    }
}
