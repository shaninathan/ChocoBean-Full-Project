using ChocoBean.DataAccess.Entities;

public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalPrice { get; set; }

    // השתנה: enum במקום string
    public OrderStatus Status { get; set; } = OrderStatus.התקבל;

    public User User { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
