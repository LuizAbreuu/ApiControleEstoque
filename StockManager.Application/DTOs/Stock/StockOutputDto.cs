namespace StockManager.Application.DTOs.Stock;

public class StockOutputDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string Observation { get; set; } = string.Empty;
}
