using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Insider_OUT.Server.Data.Models.Tokens
{
    [Table("Emails")]
    public class Email
    {
        [Key]
        [Column("EmailId")]
        public int EmailId { get; set; }

        [Required]
        [Column("EmailTokenId")]
        public int EmailTokenId { get; set; }

        [Required, MaxLength(255)]
        [Column("EmailSubject")]
        public string EmailSubject { get; set; }

        [ForeignKey(nameof(EmailTokenId))]
        public Token Token { get; set; }
    }
}