using Insider_OUT.Server.Data.Models;
using Insider_OUT.Server.Data.Models.Incidents;
using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;
using System;

namespace InsiderOUT.Server.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly DBContext _db;

        public DepartmentService(DBContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
        {
            return await _db.Departments
                .AsNoTracking()
                .Select(d => new DepartmentDto
                {
                    DepartmentId = d.DepartmentId,
                    Department = d.DepartmentName,
                    SortOrder = d.SortOrder,
                    IsActive = d.IsActive
                })
                .ToListAsync();
        }

        public async Task<DepartmentDto?> GetByIdAsync(int id)
        {
            var d = await _db.Departments.AsNoTracking()
                .FirstOrDefaultAsync(x => x.DepartmentId == id);

            if (d == null) return null;

            return new DepartmentDto
            {
                DepartmentId = d.DepartmentId,
                Department = d.DepartmentName,
                SortOrder = d.SortOrder,
                IsActive = d.IsActive
            };
        }

        public async Task<DepartmentDto> CreateAsync(DepartmentDto dto)
        {
            var entity = new Department
            {
                DepartmentName = dto.Department,
                SortOrder = dto.SortOrder,
                IsActive = dto.IsActive
            };

            _db.Departments.Add(entity);
            await _db.SaveChangesAsync();

            dto.DepartmentId = entity.DepartmentId;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, DepartmentDto dto)
        {
            var entity = await _db.Departments.FindAsync(id);
            if (entity == null) return false;

            entity.DepartmentName = dto.Department;
            entity.SortOrder = dto.SortOrder;
            entity.IsActive = dto.IsActive;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _db.Departments.FindAsync(id);
            if (entity == null) return false;

            _db.Departments.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
