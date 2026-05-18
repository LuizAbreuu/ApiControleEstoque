using StockManager.Domain.Entities;

namespace StockManager.Domain.Interfaces.Repositories;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<bool> ExistsBySkuOrBarcodeAsync(string sku, string barcode, CancellationToken cancellationToken = default);
}
