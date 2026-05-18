using Microsoft.EntityFrameworkCore;
using StockManager.Domain.Entities;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Context;

namespace StockManager.Infrastructure.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(StockManagerDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<bool> ExistsBySkuOrBarcodeAsync(string sku, string barcode, CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(x => x.Sku == sku || (!string.IsNullOrEmpty(barcode) && x.Barcode == barcode), cancellationToken);
    }
}
