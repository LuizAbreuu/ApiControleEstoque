using FluentValidation;
using StockManager.Application.DTOs.Stock;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.Validators;

public class StockEntryDtoValidator : AbstractValidator<StockEntryDto>
{
    public StockEntryDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Produto é obrigatório.");

        RuleFor(x => x.BatchNumber)
            .NotEmpty().WithMessage("Número do Lote é obrigatório.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantidade deve ser maior que zero.");

        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.UtcNow.Date).WithMessage("A data de validade deve ser maior que a data atual.");
    }
}
