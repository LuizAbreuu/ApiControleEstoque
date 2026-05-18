namespace StockManager.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }

    public User? User { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
}
