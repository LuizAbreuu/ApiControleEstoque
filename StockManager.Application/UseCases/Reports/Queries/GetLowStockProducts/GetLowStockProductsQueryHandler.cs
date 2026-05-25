using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Reports.Queries.GetLowStockProducts;

public class GetLowStockProductsQueryHandler : IRequestHandler<GetLowStockProductsQuery, Result<IEnumerable<ProductDto>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;

    public GetLowStockProductsQueryHandler(IProductRepository productRepository, IProductBatchRepository productBatchRepository)
    {
        _productRepository = productRepository;
        _productBatchRepository = productBatchRepository;
    }

    public async Task<Result<IEnumerable<ProductDto>>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync();
        var lowStockProducts = new List<ProductDto>();

        foreach (var product in products)
        {
            var batches = await _productBatchRepository.GetByProductIdAsync(product.Id);
            var currentStock = batches.Sum(x => x.Quantity);

            if (currentStock <= product.MinimumStock)
            {
                lowStockProducts.Add(new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    MinimumStock = product.MinimumStock,
                    CurrentStock = currentStock
                });
            }
        }

        return Result<IEnumerable<ProductDto>>.Success(lowStockProducts);
    }
}
