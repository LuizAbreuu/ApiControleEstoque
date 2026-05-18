using StockManager.Application.DTOs.Stock;

namespace StockManager.Application.Interfaces;

public interface IStockService
{
    Task EntryAsync(StockEntryDto dto, Guid userId);
    Task OutputAsync(StockOutputDto dto, Guid userId);
}
