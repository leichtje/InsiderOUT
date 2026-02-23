namespace InsiderOUT.Server.Models.Dto
{
    public class IncidentDto
    {
        public int IncidentId { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public DateTime Date { get; set; }
        public DateTime Updated { get; set; }
        public string Agent { get; set; }
        public int TokenId { get; set; }
        public string TokenType { get; set; }
        public string Status { get; set; }
        public int? AssignedUserId { get; set; }
        public int? TiedSubjectId { get; set; }
    }

    public class IncidentViewDto
    {
        public IncidentDto Incident { get; set; }
        public TokenDto? Token { get; set; }
        public SubjectDto? Subject { get; set; }
        public UserDto? User { get; set; }
    }
}