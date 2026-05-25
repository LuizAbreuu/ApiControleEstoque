using MediatR;
using StockManager.Application.Common;
using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Stock.Commands.StockEntry;

public class StockEntryCommandHandler : IRequestHandler<StockEntryCommand, Result>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;
    private readonly IStockMovementRepository _stockMovementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StockEntryCommandHandler(
        IProductRepository productRepository,
        IProductBatchRepository productBatchRepository,
        IStockMovementRepository stockMovementRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _productBatchRepository = productBatchRepository;
        _stockMovementRepository = stockMovementRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(StockEntryCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Dto.ProductId);
        if (product == null)
            return Result.Failure("Produto não encontrado.", "NOT_FOUND");

        var existingBatches = await _productBatchRepository.GetByProductIdAsync(request.Dto.ProductId);
        var batch = existingBatches.FirstOrDefault(x => x.BatchNumber == request.Dto.BatchNumber);

        if (batch != null)
        {
            batch.Quantity += request.Dto.Quantity;
            _productBatchRepository.Update(batch);
        }
        else
        {
            batch = new ProductBatch
            {
                ProductId = request.Dto.ProductId,
                BatchNumber = request.Dto.BatchNumber,
                Quantity = request.Dto.Quantity,
                ExpirationDate = request.Dto.ExpirationDate.Date,
                EntryDate = DateTime.UtcNow
            };
            await _productBatchRepository.AddAsync(batch);
        }

        var movement = new StockMovement
        {
            ProductBatchId = batch.Id,
            Type = MovementType.Entry,
            Quantity = request.Dto.Quantity,
            UserId = request.UserId,
            Observation = request.Dto.Observation
        };
        
        if (batch.Id == Guid.Empty) 
        {
            movement.ProductBatch = batch;
        }

        await _stockMovementRepository.AddAsync(movement);
        await _unitOfWork.CommitAsync();

        return Result.Success();
    }
}
