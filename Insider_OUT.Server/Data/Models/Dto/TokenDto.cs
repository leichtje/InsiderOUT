namespace InsiderOUT.Server.Models.Dto
{
    public class TokenDto
    {
        public int TokenId { get; set; }
        public string TokenType { get; set; }      // "document", "email", etc.
        public string TokenSeverity { get; set; }  // "Low", "Medium", "High"
    }
}
