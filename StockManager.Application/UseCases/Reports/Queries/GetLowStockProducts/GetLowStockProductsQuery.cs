using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Products;

namespace StockManager.Application.UseCases.Reports.Queries.GetLowStockProducts;

public record GetLowStockProductsQuery() : IRequest<Result<IEnumerable<ProductDto>>>;
