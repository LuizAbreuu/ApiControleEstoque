using StockManager.Domain.Entities;

namespace StockManager.Domain.Interfaces.Repositories;

public interface ICategoryRepository : IBaseRepository<Category>
{
    Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);
}
