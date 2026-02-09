using Insider_OUT.Server.Data.Models.Profiles;
using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace InsiderOUT.Server.Services
{
    public class UserService : IUserService
    {
        private readonly DBContext _db;

        public UserService(DBContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            return await _db.Users
                .AsNoTracking()
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    UserFirstName = u.UserFirstName,
                    UserLastName = u.UserLastName,
                    UserEmail = u.UserEmail,
                    UserPhone = u.UserPhone,
                    UserDepartment = u.UserDepartment
                })
                .ToListAsync();
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var u = await _db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == id);
            if (u == null) return null;
            return new UserDto
            {
                UserId = u.UserId,
                UserFirstName = u.UserFirstName,
                UserLastName = u.UserLastName,
                UserEmail = u.UserEmail,
                UserPhone = u.UserPhone,
                UserDepartment = u.UserDepartment
            };
        }

        public async Task<UserDto> CreateAsync(UserDto dto)
        {
            var entity = new User
            {
                UserFirstName = dto.UserFirstName,
                UserLastName = dto.UserLastName,
                UserEmail = dto.UserEmail,
                UserPhone = dto.UserPhone,
                UserDepartment = dto.UserDepartment
            };

            _db.Users.Add(entity);
            await _db.SaveChangesAsync();

            dto.UserId = entity.UserId;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, UserDto dto)
        {
            var entity = await _db.Users.FindAsync(id);
            if (entity == null) return false;

            entity.UserFirstName = dto.UserFirstName;
            entity.UserLastName = dto.UserLastName;
            entity.UserEmail = dto.UserEmail;
            entity.UserPhone = dto.UserPhone;
            entity.UserDepartment = dto.UserDepartment;

            _db.Users.Update(entity);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _db.Users.FindAsync(id);
            if (entity == null) return false;

            _db.Users.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}