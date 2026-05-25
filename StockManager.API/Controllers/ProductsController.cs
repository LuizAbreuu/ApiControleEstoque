using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.DTOs;
using StockManager.Application.DTOs.Products;
using StockManager.Application.UseCases.Products.Commands.CreateProduct;
using StockManager.Application.UseCases.Products.Queries.GetAllProducts;
using StockManager.Application.UseCases.Products.Queries.GetProductById;

namespace StockManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationQueryDto query)
    {
        var result = await _mediator.Send(new GetAllProductsQuery(query));
        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        if (!result.IsSuccess)
            return NotFound(new { Error = result.Error, Code = result.ErrorCode });

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto request)
    {
        var result = await _mediator.Send(new CreateProductCommand(request));
        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error, Code = result.ErrorCode });

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }
}
