using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.UseCases.Reports.Queries.ExportInventoryToExcel;
using StockManager.Application.UseCases.Reports.Queries.GetExpiredBatches;
using StockManager.Application.UseCases.Reports.Queries.GetLowStockProducts;

namespace StockManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var result = await _mediator.Send(new GetLowStockProductsQuery());
        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return Ok(result.Value);
    }

    [HttpGet("expired")]
    public async Task<IActionResult> GetExpiredBatches()
    {
        var result = await _mediator.Send(new GetExpiredBatchesQuery());
        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return Ok(result.Value);
    }

    [HttpGet("export/excel")]
    public async Task<IActionResult> ExportExcel()
    {
        var result = await _mediator.Send(new ExportInventoryToExcelQuery());
        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return File(result.Value!, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Estoque_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }
}
