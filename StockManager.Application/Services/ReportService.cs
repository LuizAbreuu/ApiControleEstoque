using ClosedXML.Excel;
using StockManager.Application.DTOs.Products;
using StockManager.Application.DTOs.Stock;
using StockManager.Application.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.Services;

public class ReportService : IReportService
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;

    public ReportService(IProductRepository productRepository, IProductBatchRepository productBatchRepository)
    {
        _productRepository = productRepository;
        _productBatchRepository = productBatchRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetLowStockProductsAsync()
    {
        var products = await _productRepository.GetAllAsync();
        var lowStockProducts = new List<ProductDto>();

        foreach (var product in products)
        {
            var batches = await _productBatchRepository.GetByProductIdAsync(product.Id);
            var currentStock = batches.Sum(x => x.Quantity);

            if (currentStock <= product.MinimumStock)
            {
                lowStockProducts.Add(new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    MinimumStock = product.MinimumStock,
                    CurrentStock = currentStock
                });
            }
        }

        return lowStockProducts;
    }

    public async Task<IEnumerable<StockEntryDto>> GetExpiredBatchesAsync()
    {
        var allBatches = await _productBatchRepository.GetAllAsync();
        
        var expiredBatches = allBatches
            .Where(x => x.Quantity > 0 && x.ExpirationDate.Date < DateTime.UtcNow.Date)
            .Select(x => new StockEntryDto
            {
                ProductId = x.ProductId,
                BatchNumber = x.BatchNumber,
                Quantity = x.Quantity,
                ExpirationDate = x.ExpirationDate
            }).ToList();

        return expiredBatches;
    }

    public async Task<byte[]> ExportInventoryToExcelAsync()
    {
        var products = await _productRepository.GetAllAsync();
        
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Estoque Atual");

        worksheet.Cell(1, 1).Value = "ID do Produto";
        worksheet.Cell(1, 2).Value = "Nome do Produto";
        worksheet.Cell(1, 3).Value = "SKU";
        worksheet.Cell(1, 4).Value = "Estoque Mínimo";
        worksheet.Cell(1, 5).Value = "Estoque Atual";
        worksheet.Cell(1, 6).Value = "Status";

        // Estilizar Cabeçalho
        var headerRange = worksheet.Range("A1:F1");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

        int row = 2;
        foreach (var product in products)
        {
            var batches = await _productBatchRepository.GetByProductIdAsync(product.Id);
            var currentStock = batches.Sum(x => x.Quantity);

            worksheet.Cell(row, 1).Value = product.Id.ToString();
            worksheet.Cell(row, 2).Value = product.Name;
            worksheet.Cell(row, 3).Value = product.Sku;
            worksheet.Cell(row, 4).Value = product.MinimumStock;
            worksheet.Cell(row, 5).Value = currentStock;
            
            var status = currentStock <= product.MinimumStock ? "Baixo Estoque" : "OK";
            worksheet.Cell(row, 6).Value = status;

            if (status == "Baixo Estoque")
            {
                worksheet.Cell(row, 6).Style.Font.FontColor = XLColor.Red;
            }

            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
