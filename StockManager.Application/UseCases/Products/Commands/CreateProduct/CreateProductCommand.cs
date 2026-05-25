using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Products;

namespace StockManager.Application.UseCases.Products.Commands.CreateProduct;

public record CreateProductCommand(CreateProductDto Dto) : IRequest<Result<ProductDto>>;
