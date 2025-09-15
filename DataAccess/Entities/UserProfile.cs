using System.ComponentModel.DataAnnotations;

namespace ChocoBean.DataAccess.Entities;

public class UserProfile
{
    [Key]  // ✅ הוספתי את זה
    public int ProfileId { get; set; }
    public int UserId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }

    public User User { get; set; } = null!;
}