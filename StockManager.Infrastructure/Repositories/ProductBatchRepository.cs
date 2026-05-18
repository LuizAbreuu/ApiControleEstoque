using Microsoft.EntityFrameworkCore;
using StockManager.Domain.Entities;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Context;

namespace StockManager.Infrastructure.Repositories;

public class ProductBatchRepository : BaseRepository<ProductBatch>, IProductBatchRepository
{
    public ProductBatchRepository(StockManagerDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IEnumerable<ProductBatch>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await DbSet.Where(x => x.ProductId == productId).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProductBatch>> GetAvailableBatchesByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await DbSet.Where(x => x.ProductId == productId && x.Quantity > 0 && x.ExpirationDate.Date >= DateTime.UtcNow.Date)
            .OrderBy(x => x.ExpirationDate) // FIFO: Lote mais próximo do vencimento
            .ThenBy(x => x.EntryDate) // Lote mais antigo
            .ToListAsync(cancellationToken);
    }
}
