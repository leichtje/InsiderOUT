using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using InsiderOUT.Server.Data.Models.Profiles;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InsiderOUT.Server.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly AppDbContext _db;

        public SubjectService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<SubjectDto>> GetAllAsync()
        {
            return await _db.Subjects
                .AsNoTracking()
                .Select(s => new SubjectDto
                {
                    SubjectId = s.SubjectId,
                    SubjectFirstName = s.SubjectFirstName,
                    SubjectLastName = s.SubjectLastName,
                    SubjectEmail = s.SubjectEmail,
                    SubjectPhone = s.SubjectPhone,
                    SubjectDepartment = s.SubjectDepartment,
                    SubjectRole = s.SubjectRole,
                    SubjectRiskScore = s.SubjectRiskScore
                })
                .ToListAsync();
        }

        public async Task<SubjectDto?> GetByIdAsync(int id)
        {
            var s = await _db.Subjects.AsNoTracking().FirstOrDefaultAsync(x => x.SubjectId == id);
            if (s == null) return null;

            return new SubjectDto
            {
                SubjectId = s.SubjectId,
                SubjectFirstName = s.SubjectFirstName,
                SubjectLastName = s.SubjectLastName,
                SubjectEmail = s.SubjectEmail,
                SubjectPhone = s.SubjectPhone,
                SubjectDepartment = s.SubjectDepartment,
                SubjectRole = s.SubjectRole,
                SubjectRiskScore = s.SubjectRiskScore
            };
        }

        public async Task<SubjectDto> CreateAsync(SubjectDto dto)
        {
            var entity = new Subject
            {
                SubjectFirstName = dto.SubjectFirstName,
                SubjectLastName = dto.SubjectLastName,
                SubjectEmail = dto.SubjectEmail,
                SubjectPhone = dto.SubjectPhone,
                SubjectDepartment = dto.SubjectDepartment,
                SubjectRole = dto.SubjectRole,
                SubjectRiskScore = dto.SubjectRiskScore
            };

            _db.Subjects.Add(entity);
            await _db.SaveChangesAsync();

            dto.SubjectId = entity.SubjectId;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, SubjectDto dto)
        {
            var entity = await _db.Subjects.FindAsync(id);
            if (entity == null) return false;

            entity.SubjectFirstName = dto.SubjectFirstName;
            entity.SubjectLastName = dto.SubjectLastName;
            entity.SubjectEmail = dto.SubjectEmail;
            entity.SubjectPhone = dto.SubjectPhone;
            entity.SubjectDepartment = dto.SubjectDepartment;
            entity.SubjectRole = dto.SubjectRole;
            entity.SubjectRiskScore = dto.SubjectRiskScore;

            _db.Subjects.Update(entity);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _db.Subjects.FindAsync(id);
            if (entity == null) return false;

            _db.Subjects.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
