using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Profiles
{
    [Table("Users")]
    public class User
    {
        [Key]
        [Column("UserId")]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        [Column("UserFirstName")]
        public string UserFirstName { get; set; }

        [Required, MaxLength(100)]
        [Column("UserLastName")]
        public string UserLastName { get; set; }

        [Required, MaxLength(255)]
        [Column("UserEmail")]
        public string UserEmail { get; set; }

        [MaxLength(50)]
        [Column("UserPhone")]
        public string UserPhone { get; set; }

        [MaxLength(100)]
        [Column("UserDepartment")]
        public string UserDepartment { get; set; }
    }
}
