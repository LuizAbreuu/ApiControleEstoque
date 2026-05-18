using StockManager.Domain.Entities;

namespace StockManager.Domain.Interfaces.Repositories;

public interface IProductBatchRepository : IBaseRepository<ProductBatch>
{
    Task<IEnumerable<ProductBatch>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductBatch>> GetAvailableBatchesByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
}
