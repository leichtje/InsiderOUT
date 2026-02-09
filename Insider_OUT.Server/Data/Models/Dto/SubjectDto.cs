namespace InsiderOUT.Server.Models.Dto
{
    public class SubjectDto
    {
        public int SubjectId { get; set; }
        public string SubjectFirstName { get; set; }
        public string SubjectLastName { get; set; }
        public string SubjectEmail { get; set; }
        public string? SubjectPhone { get; set; }
        public string? SubjectDepartment { get; set; }
        public string? SubjectRole { get; set; }
        public int SubjectRiskScore { get; set; }
    }
}
