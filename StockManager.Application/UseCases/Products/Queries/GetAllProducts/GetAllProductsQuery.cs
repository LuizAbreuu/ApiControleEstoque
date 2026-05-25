using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Models;

namespace StockManager.Application.UseCases.Products.Queries.GetAllProducts;

public record GetAllProductsQuery(PaginationQueryDto Query) : IRequest<Result<PagedResult<ProductDto>>>;
