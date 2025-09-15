namespace ChocoBean.DataAccess.Entities;

public class OrderItem
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; } // מחיר יחידה בזמן ההזמנה

    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
