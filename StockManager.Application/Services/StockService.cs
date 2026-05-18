using StockManager.Application.DTOs.Stock;
using StockManager.Application.Interfaces;
using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Exceptions;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.Services;

public class StockService : IStockService
{
    private readonly IProductRepository _productRepository;
    private readonly IProductBatchRepository _productBatchRepository;
    private readonly IStockMovementRepository _stockMovementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StockService(
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

    public async Task EntryAsync(StockEntryDto dto, Guid userId)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null) throw new NotFoundException("Produto não encontrado.");

        var existingBatches = await _productBatchRepository.GetByProductIdAsync(dto.ProductId);
        var batch = existingBatches.FirstOrDefault(x => x.BatchNumber == dto.BatchNumber);

        if (batch != null)
        {
            // RN014 - Entrada Fluxo: se existir, somar quantidade
            batch.Quantity += dto.Quantity;
            _productBatchRepository.Update(batch);
        }
        else
        {
            // RN014 - Entrada Fluxo: se não existir, criar novo lote
            batch = new ProductBatch
            {
                ProductId = dto.ProductId,
                BatchNumber = dto.BatchNumber,
                Quantity = dto.Quantity,
                ExpirationDate = dto.ExpirationDate.Date,
                EntryDate = DateTime.UtcNow
            };
            await _productBatchRepository.AddAsync(batch);
        }

        // RN009 - Gerar movimentação e histórico
        var movement = new StockMovement
        {
            ProductBatchId = batch.Id,
            Type = MovementType.Entry,
            Quantity = dto.Quantity,
            UserId = userId,
            Observation = dto.Observation
        };
        
        // Pelo fato de batch ser novo, ele pode não ter o ID gerado ainda se não deu SaveChanges. 
        // No EF Core, após o Add, ele é trackeado e o ID será setado, mas podemos setar a navigation property.
        if (batch.Id == Guid.Empty) 
        {
            movement.ProductBatch = batch;
        }

        await _stockMovementRepository.AddAsync(movement);
        await _unitOfWork.CommitAsync();
    }

    public async Task OutputAsync(StockOutputDto dto, Guid userId)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null) throw new NotFoundException("Produto não encontrado.");

        var availableBatches = await _productBatchRepository.GetAvailableBatchesByProductIdAsync(dto.ProductId);
        var totalAvailableStock = availableBatches.Sum(x => x.Quantity);

        // RN008 - Estoque negativo não permitido
        if (totalAvailableStock < dto.Quantity)
        {
            throw new BusinessException($"Estoque insuficiente. Quantidade solicitada: {dto.Quantity}, Quantidade disponível: {totalAvailableStock}");
        }

        int remainingQuantityToOutput = dto.Quantity;

        // RN006 e RN007 - Saídas devem utilizar FIFO automático / Produtos vencidos não saem (já filtrados no Repo)
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
                Quantity = quantityTakenFromBatch, // Movimentação reflete o desconto no lote específico
                UserId = userId,
                Observation = dto.Observation
            };

            await _stockMovementRepository.AddAsync(movement);
        }

        if (remainingQuantityToOutput > 0)
        {
             // Fallback de segurança caso ocorra condição de corrida (race condition)
             throw new BusinessException("Erro ao processar saída: os lotes disponíveis não cobriram a quantidade total solicitada.");
        }

        await _unitOfWork.CommitAsync();
    }
}
