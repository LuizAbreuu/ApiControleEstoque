using FluentValidation;
using StockManager.Application.DTOs.Stock;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.Validators;

public class StockOutputDtoValidator : AbstractValidator<StockOutputDto>
{
    public StockOutputDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Produto é obrigatório.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantidade de saída deve ser maior que zero.");
    }
}
