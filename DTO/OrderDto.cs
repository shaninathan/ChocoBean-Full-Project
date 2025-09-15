namespace ChocoBean.DTO
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = null!; // DTO משתמש ב-string
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
