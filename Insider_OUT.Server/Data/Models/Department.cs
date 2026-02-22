namespace Insider_OUT.Server.Data.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
