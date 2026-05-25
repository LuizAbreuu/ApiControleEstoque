using MediatR;
using StockManager.Application.Common;

namespace StockManager.Application.UseCases.Reports.Queries.ExportInventoryToExcel;

public record ExportInventoryToExcelQuery() : IRequest<Result<byte[]>>;
