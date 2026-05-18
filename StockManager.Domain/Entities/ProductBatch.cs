namespace StockManager.Domain.Entities;

public class ProductBatch : BaseEntity
{
    public Guid ProductId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public DateTime EntryDate { get; set; }

    public Product? Product { get; set; }
}
