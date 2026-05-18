using StockManager.Domain.Entities;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Context;

namespace StockManager.Infrastructure.Repositories;

public class StockMovementRepository : BaseRepository<StockMovement>, IStockMovementRepository
{
    public StockMovementRepository(StockManagerDbContext dbContext) : base(dbContext)
    {
    }
}
