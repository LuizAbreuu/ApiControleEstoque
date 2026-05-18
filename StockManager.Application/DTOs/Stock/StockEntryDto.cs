namespace StockManager.Application.DTOs.Stock;

public class StockEntryDto
{
    public Guid ProductId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string Observation { get; set; } = string.Empty;
}
