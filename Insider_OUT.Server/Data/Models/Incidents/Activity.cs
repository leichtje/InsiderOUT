using Insider_OUT.Server.Data.Models.Profiles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Incidents
{
    [Table("Activities")]
    public class Activity
    {
        [Key]
        [Column("ActivityId")]
        public int ActivityId { get; set; }

        [Required]
        [Column("ActivityContent")]
        public string ActivityContent { get; set; }

        [Required]
        [Column("ActivityDate")]
        public DateTime ActivityDate { get; set; }

        [Required]
        [Column("ActivityEntityId")]
        public int ActivityEntityId { get; set; }

        [Required, MaxLength(50)]
        [Column("ActivityEntityType")]
        public string ActivityEntityType { get; set; }

        [Column("ActivityUserId")]
        public int? ActivityUserId { get; set; }

        [ForeignKey(nameof(ActivityUserId))]
        public User User { get; set; }
    }
}
