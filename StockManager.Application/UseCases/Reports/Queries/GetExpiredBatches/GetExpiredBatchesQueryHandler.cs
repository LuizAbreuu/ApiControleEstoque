using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Stock;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Reports.Queries.GetExpiredBatches;

public class GetExpiredBatchesQueryHandler : IRequestHandler<GetExpiredBatchesQuery, Result<IEnumerable<StockEntryDto>>>
{
    private readonly IProductBatchRepository _productBatchRepository;

    public GetExpiredBatchesQueryHandler(IProductBatchRepository productBatchRepository)
    {
        _productBatchRepository = productBatchRepository;
    }

    public async Task<Result<IEnumerable<StockEntryDto>>> Handle(GetExpiredBatchesQuery request, CancellationToken cancellationToken)
    {
        var allBatches = await _productBatchRepository.GetAllAsync();
        
        var expiredBatches = allBatches
            .Where(x => x.Quantity > 0 && x.ExpirationDate.Date < DateTime.UtcNow.Date)
            .Select(x => new StockEntryDto
            {
                ProductId = x.ProductId,
                BatchNumber = x.BatchNumber,
                Quantity = x.Quantity,
                ExpirationDate = x.ExpirationDate
            }).ToList();

        return Result<IEnumerable<StockEntryDto>>.Success(expiredBatches);
    }
}
