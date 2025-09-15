using System;

namespace ChocoBean.DataAccess.Entities
{
    public class Message
    {
        public int MessageId { get; set; }
        public int FromUserId { get; set; }
        public int? ToUserId { get; set; } // NULL = message to admin(s)
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User FromUser { get; set; } = null!;
        public User? ToUser { get; set; }
    }
}
