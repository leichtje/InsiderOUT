namespace InsiderOUT.Server.Models.Dto
{
    public class DocumentDto
    {
        public int DocumentId { get; set; }
        public int TokenId { get; set; }

        public string Name { get; set; }              // DocumentName
        public string Location { get; set; }          // DocumentLocation (NOT NULL)

        public string TokenType { get; set; }         // from Tokens table
        public string TokenSeverity { get; set; }     // from Tokens table
    }
}
