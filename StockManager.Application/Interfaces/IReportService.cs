using StockManager.Application.DTOs.Products;
using StockManager.Application.DTOs.Stock;

namespace StockManager.Application.Interfaces;

public interface IReportService
{
    Task<IEnumerable<ProductDto>> GetLowStockProductsAsync();
    Task<IEnumerable<StockEntryDto>> GetExpiredBatchesAsync();
    Task<byte[]> ExportInventoryToExcelAsync();
}
