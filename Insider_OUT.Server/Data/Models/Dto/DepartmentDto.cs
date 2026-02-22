namespace InsiderOUT.Server.Models.Dto
{
    public class DepartmentDto
    {
        public int DepartmentId { get; set; }
        public string? Department { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}