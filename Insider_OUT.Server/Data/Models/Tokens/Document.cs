using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace Insider_OUT.Server.Data.Models.Tokens
{
    [Table("Documents")]
    public class Document
    {
        [Key]
        [Column("DocumentId")]
        public int DocumentId { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("DocumentName")]
        public string DocumentName { get; set; }

        [Required]
        [Column("DocumentLocation")]
        public string DocumentLocation { get; set; }

        [Required]
        [Column("DocumentTokenId")]
        public Guid DocumentTokenId { get; set; }

        [ForeignKey(nameof(DocumentTokenId))]
        public Tokens.Token Token { get; set; }

        [MaxLength(255)]
        [Column("DocumentDepartment")]
        public string? DocumentDepartment { get; set; }

        // Long text content
        [Column("DocumentContent", TypeName = "nvarchar(max)")]
        public string? DocumentContent { get; set; }

        [MaxLength(500)]
        [Column("DocumentHeader")]
        public string? DocumentHeader { get; set; }

        [MaxLength(500)]
        [Column("DocumentFilepath")]
        public string? DocumentFilepath { get; set; }
    }
}
