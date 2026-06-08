using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Dto.CategoryId, cancellationToken);
        if (category == null)
            return Result<ProductDto>.Failure("Categoria não encontrada.", "NOT_FOUND");

        if (await _productRepository.ExistsBySkuOrBarcodeAsync(request.Dto.Sku, request.Dto.Barcode, cancellationToken))
            return Result<ProductDto>.Failure("Já existe um produto com o mesmo SKU ou Código de Barras.", "CONFLICT");

        var product = new Product
        {
            Name = request.Dto.Name,
            Description = request.Dto.Description,
            Price = request.Dto.Price,
            Sku = request.Dto.Sku,
            Barcode = request.Dto.Barcode,
            MinimumStock = request.Dto.MinimumStock,
            UnitMeasure = (UnitMeasure)request.Dto.UnitMeasure,
            CategoryId = request.Dto.CategoryId
        };

        await _productRepository.AddAsync(product);
        await _unitOfWork.CommitAsync();

        var dto = new ProductDto
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
            CategoryName = category.Name,
            CurrentStock = 0 // Initial stock is 0
        };

        return Result<ProductDto>.Success(dto);
    }
}
