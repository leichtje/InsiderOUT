using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Profiles
{
    [Table("Subjects")]
    public class Subject
    {
        [Key]
        [Column("SubjectId")]
        public int SubjectId { get; set; }

        [Required, MaxLength(100)]
        [Column("SubjectFirstName")]
        public string SubjectFirstName { get; set; }

        [Required, MaxLength(100)]
        [Column("SubjectLastName")]
        public string SubjectLastName { get; set; }

        [Required, MaxLength(255)]
        [Column("SubjectEmail")]
        public string SubjectEmail { get; set; }

        [MaxLength(50)]
        [Column("SubjectPhone")]
        public string SubjectPhone { get; set; }

        [MaxLength(100)]
        [Column("SubjectDepartment")]
        public string SubjectDepartment { get; set; }

        [MaxLength(100)]
        [Column("SubjectRole")]
        public string SubjectRole { get; set; }

        [Column("SubjectRiskScore")]
        public int SubjectRiskScore { get; set; }
    }
}
