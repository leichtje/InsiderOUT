using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly AppDbContext _context;

        public DocumentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DocumentDto>> GetAllAsync()
        {
            var docs = await _context.Documents.ToListAsync();

            var list = new List<DocumentDto>();

            foreach (var d in docs)
            {
                list.Add(new DocumentDto
                {
                    DocumentId = d.DocumentId,
                    TokenId = d.DocumentTokenId,
                    DocumentName = d.DocumentName,
                    DocumentLocation = d.DocumentLocation,
                    TokenType = d.TokenType,
                    TokenSeverity = d.TokenSeverity,
                    CreatedDate = d.CreatedDate,
                    UpdatedDate = d.UpdatedDate,
                    DocumentDepartment = d.DocumentDepartment,
                    DocumentContent = d.DocumentContent,
                    DocumentHeader = d.DocumentHeader,
                    DocumentFilepath = d.DocumentFilepath
                });
            }

            return list;
        }

        public async Task<DocumentDto?> GetByIdAsync(Guid id)
        {
            var d = await _context.Documents
                .FirstOrDefaultAsync(x => x.DocumentTokenId == id);

            if (d == null)
                return null;

            return new DocumentDto
            {
                DocumentId = d.DocumentId,
                TokenId = d.DocumentTokenId,
                DocumentName = d.DocumentName,
                DocumentLocation = d.DocumentLocation,
                TokenType = d.TokenType,
                TokenSeverity = d.TokenSeverity,
                CreatedDate = d.CreatedDate,
                UpdatedDate = d.UpdatedDate,
                DocumentDepartment = d.DocumentDepartment,
                DocumentContent = d.DocumentContent,
                DocumentHeader = d.DocumentHeader,
                DocumentFilepath = d.DocumentFilepath
            };
        }

        public async Task<DocumentDto> CreateAsync(DocumentDto dto)
        {
            var entity = new Document
            {
                DocumentName = dto.DocumentName,
                DocumentLocation = dto.DocumentLocation,
                DocumentTokenId = dto.TokenId,
                TokenType = dto.TokenType,
                TokenSeverity = dto.TokenSeverity,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                DocumentDepartment = dto.DocumentDepartment,
                DocumentContent = dto.DocumentContent,
                DocumentHeader = dto.DocumentHeader,
                DocumentFilepath = dto.DocumentFilepath
            };

            _context.Documents.Add(entity);
            await _context.SaveChangesAsync();

            return new DocumentDto
            {
                DocumentId = entity.DocumentId,
                TokenId = entity.DocumentTokenId,
                DocumentName = entity.DocumentName,
                DocumentLocation = entity.DocumentLocation,
                TokenType = entity.TokenType,
                TokenSeverity = entity.TokenSeverity,
                CreatedDate = entity.CreatedDate,
                UpdatedDate = entity.UpdatedDate,
                DocumentDepartment = entity.DocumentDepartment,
                DocumentContent = entity.DocumentContent,
                DocumentHeader = entity.DocumentHeader,
                DocumentFilepath = entity.DocumentFilepath
            };
        }

        public async Task<DocumentDto?> UpdateAsync(Guid id, DocumentDto dto)
        {
            var entity = await _context.Documents
                .FirstOrDefaultAsync(x => x.DocumentTokenId == id);

            if (entity == null)
                return null;

            entity.DocumentName = dto.DocumentName;
            entity.DocumentLocation = dto.DocumentLocation;
            entity.TokenType = dto.TokenType;
            entity.TokenSeverity = dto.TokenSeverity;
            entity.UpdatedDate = DateTime.UtcNow;
            entity.DocumentDepartment = dto.DocumentDepartment;
            entity.DocumentContent = dto.DocumentContent;
            entity.DocumentHeader = dto.DocumentHeader;
            entity.DocumentFilepath = dto.DocumentFilepath;

            await _context.SaveChangesAsync();

            return new DocumentDto
            {
                DocumentId = entity.DocumentId,
                TokenId = entity.DocumentTokenId,
                DocumentName = entity.DocumentName,
                DocumentLocation = entity.DocumentLocation,
                TokenType = entity.TokenType,
                TokenSeverity = entity.TokenSeverity,
                CreatedDate = entity.CreatedDate,
                UpdatedDate = entity.UpdatedDate,
                DocumentDepartment = entity.DocumentDepartment,
                DocumentContent = entity.DocumentContent,
                DocumentHeader = entity.DocumentHeader,
                DocumentFilepath = entity.DocumentFilepath
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Documents
                .FirstOrDefaultAsync(x => x.DocumentTokenId == id);

            if (entity == null)
                return false;

            _context.Documents.Remove(entity);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
