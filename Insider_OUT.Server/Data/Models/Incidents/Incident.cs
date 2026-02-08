using Insider_OUT.Server.Data.Models.Profiles;
using Insider_OUT.Server.Data.Models.Tokens;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Incidents
{
    [Table("Incidents")]
    public class Incident
    {
        [Key]
        [Column("IncidentId")]
        public int IncidentId { get; set; }

        [Required, MaxLength(255)]
        [Column("IncidentTitle")]
        public string IncidentTitle { get; set; }

        [Required]
        [Column("IncidentDescription")]
        public string IncidentDescription { get; set; }

        [Required]
        [Column("IncidentCreatedDate")]
        public DateTime IncidentCreatedDate { get; set; }

        [Required]
        [Column("IncidentUpdatedDate")]
        public DateTime IncidentUpdatedDate { get; set; }

        [Required, MaxLength(255)]
        [Column("IncidentAgent")]
        public string IncidentAgent { get; set; }

        [Required]
        [Column("IncidentTokenId")]
        public int IncidentTokenId { get; set; }

        [Required, MaxLength(50)]
        [Column("IncidentTokenType")]
        public string IncidentTokenType { get; set; }

        [Required, MaxLength(50)]
        [Column("IncidentStatus")]
        public string IncidentStatus { get; set; }

        [Column("IncidentAssignedUserId")]
        public int? IncidentAssignedUserId { get; set; }

        [Column("IncidentTiedSubjectId")]
        public int? IncidentTiedSubjectId { get; set; }

        [ForeignKey(nameof(IncidentAssignedUserId))]
        public User AssignedUser { get; set; }

        [ForeignKey(nameof(IncidentTiedSubjectId))]
        public Subject TiedSubject { get; set; }

        [ForeignKey(nameof(IncidentTokenId))]
        public Token Token { get; set; }
    }
}