using StockManager.Application.DTOs;
using StockManager.Application.DTOs.Products;
using StockManager.Application.Interfaces;
using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Exceptions;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Domain.Models;

namespace StockManager.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductBatchRepository _productBatchRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IProductBatchRepository productBatchRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _productBatchRepository = productBatchRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null) throw new NotFoundException("Categoria não encontrada.");

        if (await _productRepository.ExistsBySkuOrBarcodeAsync(dto.Sku, dto.Barcode))
            throw new BusinessException("Já existe um produto com o mesmo SKU ou Código de Barras.");

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Sku = dto.Sku,
            Barcode = dto.Barcode,
            MinimumStock = dto.MinimumStock,
            UnitMeasure = (UnitMeasure)dto.UnitMeasure,
            CategoryId = dto.CategoryId
        };

        await _productRepository.AddAsync(product);
        await _unitOfWork.CommitAsync();

        return await GetByIdAsync(product.Id);
    }

    public async Task<ProductDto> GetByIdAsync(Guid id)
    {
        var products = await _productRepository.FindAsync(x => x.Id == id);
        var product = products.FirstOrDefault();
        
        if (product == null) throw new NotFoundException("Produto não encontrado.");

        var batches = await _productBatchRepository.GetByProductIdAsync(id);
        var currentStock = batches.Sum(x => x.Quantity);

        return new ProductDto
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
            CurrentStock = currentStock
        };
    }

    public async Task<PagedResult<ProductDto>> GetAllAsync(PaginationQueryDto query)
    {
        var products = await _productRepository.GetAllAsync();
        
        // Em um cenário real de alta volumetria, faríamos a paginação diretamente no BD (IQueryable)
        // Como o IBaseRepository atual retorna IEnumerable, fazemos em memória para esta iteração.
        var totalCount = products.Count();
        
        var pagedProducts = products
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToList();

        var dtos = new List<ProductDto>();
        foreach(var product in pagedProducts)
        {
            var batches = await _productBatchRepository.GetByProductIdAsync(product.Id);
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
                CurrentStock = currentStock
            });
        }

        return new PagedResult<ProductDto>
        {
            Data = dtos,
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
