using ChocoBean.DataAccess.Entities;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "פעיל";

    public bool IsAdmin { get; set; } = false; // חדש

    public UserProfile? Profile { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
