using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Tokens
{
    [Table("Tokens")]
    public class Token
    {
        [Key]
        [Column("TokenId")]
        public int TokenId { get; set; }

        [Required, MaxLength(50)]
        [Column("TokenType")]
        public string TokenType { get; set; }

        [Required, MaxLength(50)]
        [Column("TokenSeverity")]
        public string TokenSeverity { get; set; }

        [Required]
        [Column("CreatedDate")]
        public DateTime CreatedDate { get; set; }

        [Required]
        [Column("UpdatedDate")]
        public DateTime UpdatedDate { get; set; }

        // Navigation properties for subtypes (one-to-one)
        public Document Document { get; set; }
        public Email Email { get; set; }
    }
}

