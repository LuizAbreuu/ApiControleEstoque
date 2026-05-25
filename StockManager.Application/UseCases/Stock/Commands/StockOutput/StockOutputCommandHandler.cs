using MediatR;
using StockManager.Application.Common;
using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Stock.Commands.StockOutput;

public class StockOutputCommandHandler : IRequestHandler<StockOutputCommand, Result>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;
    private readonly IStockMovementRepository _stockMovementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StockOutputCommandHandler(
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

    public async Task<Result> Handle(StockOutputCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Dto.ProductId);
        if (product == null)
            return Result.Failure("Produto não encontrado.", "NOT_FOUND");

        var availableBatches = await _productBatchRepository.GetAvailableBatchesByProductIdAsync(request.Dto.ProductId);
        var totalAvailableStock = availableBatches.Sum(x => x.Quantity);

        if (totalAvailableStock < request.Dto.Quantity)
        {
            return Result.Failure($"Estoque insuficiente. Quantidade solicitada: {request.Dto.Quantity}, Quantidade disponível: {totalAvailableStock}", "INSUFFICIENT_STOCK");
        }

        int remainingQuantityToOutput = request.Dto.Quantity;

        foreach (var batch in availableBatches)
        {
            if (remainingQuantityToOutput <= 0) break;

            int quantityTakenFromBatch = Math.Min(batch.Quantity, remainingQuantityToOutput);
            
            batch.Quantity -= quantityTakenFromBatch;
            remainingQuantityToOutput -= quantityTakenFromBatch;

            _productBatchRepository.Update(batch);

            var movement = new StockMovement
            {
                ProductBatchId = batch.Id,
                Type = MovementType.Output,
                Quantity = quantityTakenFromBatch,
                UserId = request.UserId,
                Observation = request.Dto.Observation
            };

            await _stockMovementRepository.AddAsync(movement);
        }

        if (remainingQuantityToOutput > 0)
        {
            return Result.Failure("Erro ao processar saída: os lotes disponíveis não cobriram a quantidade total solicitada.", "STOCK_ERROR");
        }

        await _unitOfWork.CommitAsync();

        return Result.Success();
    }
}
