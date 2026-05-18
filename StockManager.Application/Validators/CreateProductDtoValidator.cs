using FluentValidation;
using StockManager.Application.DTOs.Products;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.Validators;

public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(150).WithMessage("Nome pode ter no máximo 150 caracteres.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Preço deve ser maior que zero.");

        RuleFor(x => x.Sku)
            .NotEmpty().WithMessage("SKU é obrigatório.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Categoria é obrigatória.");
    }
}
