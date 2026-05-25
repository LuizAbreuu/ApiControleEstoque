using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Stock;

namespace StockManager.Application.UseCases.Reports.Queries.GetExpiredBatches;

public record GetExpiredBatchesQuery() : IRequest<Result<IEnumerable<StockEntryDto>>>;
