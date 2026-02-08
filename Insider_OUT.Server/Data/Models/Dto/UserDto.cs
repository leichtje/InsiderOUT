namespace InsiderOUT.Server.Models.Dto
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserEmail { get; set; }
        public string? UserPhone { get; set; }
        public string? UserDepartment { get; set; }
    }
}