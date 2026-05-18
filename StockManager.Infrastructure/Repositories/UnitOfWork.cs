using StockManager.Domain.Interfaces;
using StockManager.Infrastructure.Context;

namespace StockManager.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly StockManagerDbContext _dbContext;

    public UnitOfWork(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
