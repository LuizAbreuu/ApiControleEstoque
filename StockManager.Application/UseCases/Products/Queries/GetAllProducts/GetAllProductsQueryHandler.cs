using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Domain.Models;

namespace StockManager.Application.UseCases.Products.Queries.GetAllProducts;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, Result<PagedResult<ProductDto>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetAllProductsQueryHandler(
        IProductRepository productRepository,
        IProductBatchRepository productBatchRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _productBatchRepository = productBatchRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<PagedResult<ProductDto>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        var categories = (await _categoryRepository.GetAllAsync(cancellationToken))
            .ToDictionary(x => x.Id, x => x.Name);
        
        var totalCount = products.Count();
        
        var pagedProducts = products
            .Skip((request.Query.PageNumber - 1) * request.Query.PageSize)
            .Take(request.Query.PageSize)
            .ToList();

        var dtos = new List<ProductDto>();
        foreach(var product in pagedProducts)
        {
            var batches = await _productBatchRepository.GetByProductIdAsync(product.Id, cancellationToken);
            var currentStock = batches.Sum(x => x.Quantity);

            dtos.Add(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Sku = product.Sku,
                Barcode = product.Barcode,
                MinimumStock = product.MinimumStock,
                UnitMeasure = product.UnitMeasure.ToString(),
                CategoryId = product.CategoryId,
                CategoryName = categories.GetValueOrDefault(product.CategoryId, string.Empty),
                CurrentStock = currentStock
            });
        }

        var result = new PagedResult<ProductDto>
        {
            Data = dtos,
            TotalCount = totalCount,
            PageNumber = request.Query.PageNumber,
            PageSize = request.Query.PageSize
        };

        return Result<PagedResult<ProductDto>>.Success(result);
    }
}
