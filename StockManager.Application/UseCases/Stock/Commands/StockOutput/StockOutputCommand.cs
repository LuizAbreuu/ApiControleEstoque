using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Stock;

namespace StockManager.Application.UseCases.Stock.Commands.StockOutput;

public record StockOutputCommand(StockOutputDto Dto, Guid UserId) : IRequest<Result>;
