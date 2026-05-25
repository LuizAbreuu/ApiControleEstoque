using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.DTOs.Stock;
using StockManager.Application.UseCases.Stock.Commands.StockEntry;
using StockManager.Application.UseCases.Stock.Commands.StockOutput;

namespace StockManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockController : ControllerBase
{
    private readonly IMediator _mediator;

    public StockController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("entry")]
    public async Task<IActionResult> Entry([FromBody] StockEntryDto request)
    {
        var userId = GetCurrentUserId();
        var result = await _mediator.Send(new StockEntryCommand(request, userId));
        
        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return Ok(new { Message = "Entrada registrada com sucesso." });
    }

    [HttpPost("output")]
    public async Task<IActionResult> Output([FromBody] StockOutputDto request)
    {
        var userId = GetCurrentUserId();
        var result = await _mediator.Send(new StockOutputCommand(request, userId));

        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return Ok(new { Message = "Saída registrada com sucesso." });
    }

    private Guid GetCurrentUserId()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdStr, out var userId) ? userId : Guid.Empty;
    }
}
