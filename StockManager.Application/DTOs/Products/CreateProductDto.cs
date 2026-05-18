namespace StockManager.Application.DTOs.Products;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int MinimumStock { get; set; }
    public int UnitMeasure { get; set; }
    public Guid CategoryId { get; set; }
}
