namespace ChocoBean.DTO
{
    public class MessageDto
    {
        public int MessageId { get; set; }
        public int FromUserId { get; set; }
        public string? FromUserName { get; set; }
        public int? ToUserId { get; set; }
        public string? ToUserName { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
