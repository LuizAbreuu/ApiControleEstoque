using ClosedXML.Excel;
using MediatR;
using StockManager.Application.Common;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Reports.Queries.ExportInventoryToExcel;

public class ExportInventoryToExcelQueryHandler : IRequestHandler<ExportInventoryToExcelQuery, Result<byte[]>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;

    public ExportInventoryToExcelQueryHandler(IProductRepository productRepository, IProductBatchRepository productBatchRepository)
    {
        _productRepository = productRepository;
        _productBatchRepository = productBatchRepository;
    }

    public async Task<Result<byte[]>> Handle(ExportInventoryToExcelQuery request, CancellationToken cancellationToken)
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
        return Result<byte[]>.Success(stream.ToArray());
    }
}
