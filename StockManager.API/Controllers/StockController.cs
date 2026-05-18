using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.DTOs.Stock;
using StockManager.Application.Interfaces;

namespace StockManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockController : ControllerBase
{
    private readonly IStockService _stockService;

    public StockController(IStockService stockService)
    {
        _stockService = stockService;
    }

    [HttpPost("entry")]
    public async Task<IActionResult> Entry([FromBody] StockEntryDto request)
    {
        var userId = GetCurrentUserId();
        await _stockService.EntryAsync(request, userId);
        return Ok(new { Message = "Entrada registrada com sucesso." });
    }

    [HttpPost("output")]
    public async Task<IActionResult> Output([FromBody] StockOutputDto request)
    {
        var userId = GetCurrentUserId();
        await _stockService.OutputAsync(request, userId);
        return Ok(new { Message = "Saída registrada com sucesso." });
    }

    private Guid GetCurrentUserId()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdStr, out var userId) ? userId : Guid.Empty;
    }
}
