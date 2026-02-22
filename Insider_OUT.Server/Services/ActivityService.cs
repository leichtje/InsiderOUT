using Insider_OUT.Server.Data.Models.Incidents;
using InsiderOUT.Server.Data;
using InsiderOUT.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace InsiderOUT.Server.Services
{
    public class ActivityService : IActivityService
    {
        private readonly DBContext _db;

        public ActivityService(DBContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ActivityDto>> GetAllAsync()
        {
            return await _db.Activities
                .AsNoTracking()
                .Select(a => new ActivityDto
                {
                    ActivityId = a.ActivityId,
                    Content = a.ActivityContent,
                    Date = a.ActivityDate,
                    EntityId = a.ActivityEntityId,
                    EntityType = a.ActivityEntityType,
                    UserId = a.ActivityUserId
                })
                .ToListAsync();
        }

        public async Task<ActivityDto?> GetByIdAsync(int id)
        {
            var a = await _db.Activities
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ActivityId == id);

            if (a == null) return null;

            return new ActivityDto
            {
                ActivityId = a.ActivityId,
                Content = a.ActivityContent,
                Date = a.ActivityDate,
                EntityId = a.ActivityEntityId,
                EntityType = a.ActivityEntityType,
                UserId = a.ActivityUserId
            };
        }

        public async Task<IEnumerable<ActivityDto>> GetByEntityAsync(int entityId, string entityType)
        {
            return await _db.Activities
                .AsNoTracking()
                .Where(a => a.ActivityEntityId == entityId && a.ActivityEntityType == entityType)
                .Select(a => new ActivityDto
                {
                    ActivityId = a.ActivityId,
                    Content = a.ActivityContent,
                    Date = a.ActivityDate,
                    EntityId = a.ActivityEntityId,
                    EntityType = a.ActivityEntityType,
                    UserId = a.ActivityUserId
                })
                .ToListAsync();
        }

        public async Task<ActivityDto> CreateAsync(ActivityDto dto)
        {
            var entity = new Activity
            {
                ActivityContent = dto.Content,
                ActivityDate = dto.Date,
                ActivityEntityId = dto.EntityId,
                ActivityEntityType = dto.EntityType,
                ActivityUserId = dto.UserId
            };

            _db.Activities.Add(entity);
            await _db.SaveChangesAsync();

            dto.ActivityId = entity.ActivityId;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _db.Activities.FindAsync(id);
            if (entity == null) return false;

            _db.Activities.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
