using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Stock;

namespace StockManager.Application.UseCases.Stock.Commands.StockEntry;

public record StockEntryCommand(StockEntryDto Dto, Guid UserId) : IRequest<Result>;
