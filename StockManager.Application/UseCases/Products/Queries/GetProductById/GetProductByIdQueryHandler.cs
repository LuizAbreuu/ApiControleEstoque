using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetProductByIdQueryHandler(
        IProductRepository productRepository,
        IProductBatchRepository productBatchRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _productBatchRepository = productBatchRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.FindAsync(x => x.Id == request.Id, cancellationToken);
        var product = products.FirstOrDefault();
        
        if (product == null)
            return Result<ProductDto>.Failure("Produto não encontrado.", "NOT_FOUND");

        var batches = await _productBatchRepository.GetByProductIdAsync(request.Id, cancellationToken);
        var category = await _categoryRepository.GetByIdAsync(product.CategoryId, cancellationToken);
        var currentStock = batches.Sum(x => x.Quantity);

        return Result<ProductDto>.Success(new ProductDto
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
            CategoryName = category?.Name ?? string.Empty,
            CurrentStock = currentStock
        });
    }
}
