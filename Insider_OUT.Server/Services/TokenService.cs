using Insider_OUT.Server.Data.Models.Profiles;
using Insider_OUT.Server.Data.Models.Tokens;
using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace InsiderOUT.Server.Services
{
    public class TokenService : ITokenService
    {
        private readonly DBContext _db;

        public TokenService(DBContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<TokenDto>> GetAllAsync()
        {
            return await _db.Tokens
                .AsNoTracking()
                .Select(t => new TokenDto
                {
                    TokenId = t.TokenId,
                    TokenType = t.TokenType,
                    TokenSeverity = t.TokenSeverity
                })
                .ToListAsync();
        }

        public async Task<TokenDto?> GetByIdAsync(int id)
        {
            var t = await _db.Tokens.AsNoTracking()
                .FirstOrDefaultAsync(x => x.TokenId == id);

            if (t == null) return null;

            return new TokenDto
            {
                TokenId = t.TokenId,
                TokenType = t.TokenType,
                TokenSeverity = t.TokenSeverity
            };
        }

        public async Task<TokenDto> CreateAsync(TokenDto dto)
        {
            var entity = new Token
            {
                TokenType = dto.TokenType,
                TokenSeverity = dto.TokenSeverity
            };

            _db.Tokens.Add(entity);
            await _db.SaveChangesAsync();

            dto.TokenId = entity.TokenId;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, TokenDto dto)
        {
            var entity = await _db.Tokens.FindAsync(id);
            if (entity == null) return false;

            entity.TokenType = dto.TokenType;
            entity.TokenSeverity = dto.TokenSeverity;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _db.Tokens.FindAsync(id);
            if (entity == null) return false;

            _db.Tokens.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
