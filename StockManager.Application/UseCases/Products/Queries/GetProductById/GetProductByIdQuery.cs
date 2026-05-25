using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Products;

namespace StockManager.Application.UseCases.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<Result<ProductDto>>;
