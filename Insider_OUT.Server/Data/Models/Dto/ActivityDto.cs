namespace InsiderOUT.Server.Models.Dto
{
    public class ActivityDto
    {
        public int ActivityId { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public int EntityId { get; set; }
        public string EntityType { get; set; }
        public int? UserId { get; set; }
    }
}
