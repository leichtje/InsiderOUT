using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Tokens
{
    [Table("Documents")]
    public class Document
    {
        [Key]
        [Column("DocumentId")]
        public int DocumentId { get; set; }

        [Required]
        [Column("DocumentTokenId")]
        public int DocumentTokenId { get; set; }

        [Required, MaxLength(255)]
        [Column("DocumentName")]
        public string DocumentName { get; set; }

        [Required, MaxLength(500)]
        [Column("DocumentLocation")]
        public string DocumentLocation { get; set; }

        [ForeignKey(nameof(DocumentTokenId))]
        public Token Token { get; set; }
    }
}