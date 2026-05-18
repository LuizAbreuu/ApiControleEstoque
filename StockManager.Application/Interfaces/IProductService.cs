using StockManager.Application.DTOs;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Models;

namespace StockManager.Application.Interfaces;

public interface IProductService
{
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto> GetByIdAsync(Guid id);
    Task<PagedResult<ProductDto>> GetAllAsync(PaginationQueryDto query);
}
