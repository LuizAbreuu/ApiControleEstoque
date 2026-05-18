using FluentAssertions;
using Moq;
using StockManager.Application.DTOs.Stock;
using StockManager.Application.Services;
using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Exceptions;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Tests.Services;

public class StockServiceTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<IProductBatchRepository> _productBatchRepositoryMock;
    private readonly Mock<IStockMovementRepository> _stockMovementRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly StockService _stockService;

    public StockServiceTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _productBatchRepositoryMock = new Mock<IProductBatchRepository>();
        _stockMovementRepositoryMock = new Mock<IStockMovementRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _stockService = new StockService(
            _productRepositoryMock.Object,
            _productBatchRepositoryMock.Object,
            _stockMovementRepositoryMock.Object,
            _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task OutputAsync_ShouldThrowException_WhenStockIsInsufficient()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var dto = new StockOutputDto { ProductId = productId, Quantity = 10 };

        _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Product { Id = productId, Name = "Produto Teste" });

        var availableBatches = new List<ProductBatch>
        {
            new ProductBatch { Id = Guid.NewGuid(), Quantity = 5 } // Somente 5 disponíveis, requeremos 10
        };

        _productBatchRepositoryMock.Setup(repo => repo.GetAvailableBatchesByProductIdAsync(productId))
            .ReturnsAsync(availableBatches);

        // Act & Assert
        var act = async () => await _stockService.OutputAsync(dto, userId);

        await act.Should().ThrowAsync<BusinessException>()
            .WithMessage("Estoque insuficiente*");
    }

    [Fact]
    public async Task OutputAsync_ShouldApplyFifoLogic_WhenMultipleBatchesAreAvailable()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var dto = new StockOutputDto { ProductId = productId, Quantity = 15 };

        _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Product { Id = productId, Name = "Produto Teste" });

        var batch1 = new ProductBatch { Id = Guid.NewGuid(), Quantity = 10, BatchNumber = "Lote1" }; // Lote mais antigo (deve esvaziar)
        var batch2 = new ProductBatch { Id = Guid.NewGuid(), Quantity = 10, BatchNumber = "Lote2" }; // Segundo lote (deve ser descontado em 5)

        // O repositório já retorna na ordem correta (por Validade ou Data de Entrada)
        var availableBatches = new List<ProductBatch> { batch1, batch2 };

        _productBatchRepositoryMock.Setup(repo => repo.GetAvailableBatchesByProductIdAsync(productId))
            .ReturnsAsync(availableBatches);

        // Act
        await _stockService.OutputAsync(dto, userId);

        // Assert
        batch1.Quantity.Should().Be(0); // Pegou os 10 daqui
        batch2.Quantity.Should().Be(5); // Pegou os 5 restantes daqui

        // Garante que o update foi chamado para os dois lotes afetados
        _productBatchRepositoryMock.Verify(repo => repo.Update(It.IsAny<ProductBatch>()), Times.Exactly(2));
        
        // Garante que gerou o histórico de movimento para as duas saídas
        _stockMovementRepositoryMock.Verify(repo => repo.AddAsync(It.Is<StockMovement>(m => m.Type == MovementType.Output), It.IsAny<CancellationToken>()), Times.Exactly(2));
        
        // Garante que o Commit foi chamado apenas 1 vez ao final de toda a transação
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
