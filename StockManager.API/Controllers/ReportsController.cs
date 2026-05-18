using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Interfaces;

namespace StockManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var result = await _reportService.GetLowStockProductsAsync();
        return Ok(result);
    }

    [HttpGet("expired")]
    public async Task<IActionResult> GetExpiredBatches()
    {
        var result = await _reportService.GetExpiredBatchesAsync();
        return Ok(result);
    }

    [HttpGet("export/excel")]
    public async Task<IActionResult> ExportExcel()
    {
        var fileContent = await _reportService.ExportInventoryToExcelAsync();
        return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Estoque_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }
}
