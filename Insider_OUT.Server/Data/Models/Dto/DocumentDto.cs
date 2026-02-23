namespace InsiderOUT.Server.Models.Dto
{
    public class DocumentDto
    {
        public int DocumentId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentLocation { get; set; }

        public int TokenId { get; set; }
        public string TokenType { get; set; }
        public string TokenSeverity { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
