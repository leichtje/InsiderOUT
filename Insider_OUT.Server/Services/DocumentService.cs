using Insider_OUT.Server.Data.Models.Tokens;
using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;
using System;

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
                .Join(
                    _db.Tokens,
                    d => d.DocumentTokenId,
                    t => t.TokenId,
                    (d, t) => new DocumentDto
                    {
                        DocumentId = d.DocumentId,
                        TokenId = t.TokenId,
                        Name = d.DocumentName,
                        Location = d.DocumentLocation,
                        TokenType = t.TokenType,
                        TokenSeverity = t.TokenSeverity
                    })
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<DocumentDto?> GetByIdAsync(int documentId)
        {
            return await _db.Documents
                .Where(d => d.DocumentId == documentId)
                .Join(
                    _db.Tokens,
                    d => d.DocumentTokenId,
                    t => t.TokenId,
                    (d, t) => new DocumentDto
                    {
                        DocumentId = d.DocumentId,
                        TokenId = t.TokenId,
                        Name = d.DocumentName,
                        Location = d.DocumentLocation,
                        TokenType = t.TokenType,
                        TokenSeverity = t.TokenSeverity
                    })
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<DocumentDto> CreateAsync(DocumentDto dto)
        {
            // Create Token first
            var token = new Token
            {
                TokenType = dto.TokenType,
                TokenSeverity = dto.TokenSeverity
            };

            _db.Tokens.Add(token);
            await _db.SaveChangesAsync();

            // Create Document linked to Token
            var document = new Document
            {
                DocumentTokenId = token.TokenId,
                DocumentName = dto.Name,
                DocumentLocation = dto.Location   // REQUIRED (NOT NULL)
            };

            _db.Documents.Add(document);
            await _db.SaveChangesAsync();

            dto.TokenId = token.TokenId;
            dto.DocumentId = document.DocumentId;

            return dto;
        }

        public async Task<bool> UpdateAsync(int documentId, DocumentDto dto)
        {
            var document = await _db.Documents.FindAsync(documentId);
            if (document == null) return false;

            var token = await _db.Tokens.FindAsync(document.DocumentTokenId);
            if (token == null) return false;

            document.DocumentName = dto.Name;
            document.DocumentLocation = dto.Location;

            token.TokenType = dto.TokenType;
            token.TokenSeverity = dto.TokenSeverity;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int documentId)
        {
            var document = await _db.Documents.FindAsync(documentId);
            if (document == null) return false;

            var token = await _db.Tokens.FindAsync(document.DocumentTokenId);

            _db.Documents.Remove(document);
            if (token != null)
                _db.Tokens.Remove(token);

            await _db.SaveChangesAsync();
            return true;
        }
    }
}