namespace InsiderOUT.Server.Models.Dto
{
    public class TokenDto
    {
        public Guid TokenId { get; set; }
        public string TokenType { get; set; }
        public string TokenSeverity { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
