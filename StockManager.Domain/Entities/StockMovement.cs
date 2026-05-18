using StockManager.Domain.Enums;

namespace StockManager.Domain.Entities;

public class StockMovement : BaseEntity
{
    public Guid ProductBatchId { get; set; }
    public MovementType Type { get; set; }
    public int Quantity { get; set; }
    public Guid UserId { get; set; }
    public string Observation { get; set; } = string.Empty;

    public ProductBatch? ProductBatch { get; set; }
    public User? User { get; set; }
}
