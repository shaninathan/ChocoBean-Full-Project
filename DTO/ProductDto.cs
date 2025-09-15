namespace ChocoBean.DTO;

public class ProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int UnitsInPackage { get; set; }
}
