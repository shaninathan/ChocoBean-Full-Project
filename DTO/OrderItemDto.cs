namespace ChocoBean.DTO
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }          // חדש
        public string? ProductDescription { get; set; }   // חדש (אופציונלי)
        public int Quantity { get; set; }
        public decimal Price { get; set; } // price at order time
    }
}
