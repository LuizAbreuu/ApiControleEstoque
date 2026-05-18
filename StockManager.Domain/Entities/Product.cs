using StockManager.Domain.Enums;

namespace StockManager.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Sku { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;

    public int MinimumStock { get; set; }

    public UnitMeasure UnitMeasure { get; set; }

    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
}
