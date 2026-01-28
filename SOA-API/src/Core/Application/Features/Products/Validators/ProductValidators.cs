using Application.Features.Products.Models;
using FluentValidation;

namespace Application.Features.Products.Validators;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage("Category ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Product name is required")
            .MaximumLength(200)
            .WithMessage("Product name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => x.BasePrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Base price must be non-negative");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Sort order must be non-negative");

        When(x => x.Sizes != null && x.Sizes.Any(), () =>
        {
            RuleForEach(x => x.Sizes).SetValidator(new CreateProductSizeRequestValidator());
        });
    }
}

public class CreateProductSizeRequestValidator : AbstractValidator<CreateProductSizeRequest>
{
    public CreateProductSizeRequestValidator()
    {
        RuleFor(x => x.SizeName)
            .NotEmpty()
            .WithMessage("Size name is required")
            .MaximumLength(50)
            .WithMessage("Size name must not exceed 50 characters");

        RuleFor(x => x.PriceAdjustment)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Price adjustment must be non-negative");
    }
}

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage("Category ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Product name is required")
            .MaximumLength(200)
            .WithMessage("Product name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => x.BasePrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Base price must be non-negative");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Sort order must be non-negative");
    }
}

public class UpdateProductSizeRequestValidator : AbstractValidator<UpdateProductSizeRequest>
{
    public UpdateProductSizeRequestValidator()
    {
        RuleFor(x => x.SizeName)
            .NotEmpty()
            .WithMessage("Size name is required")
            .MaximumLength(50)
            .WithMessage("Size name must not exceed 50 characters");

        RuleFor(x => x.PriceAdjustment)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Price adjustment must be non-negative");
    }
}

public class ProductToppingRequestValidator : AbstractValidator<ProductToppingRequest>
{
    public ProductToppingRequestValidator()
    {
        RuleFor(x => x.ToppingId)
            .NotEmpty()
            .WithMessage("Topping ID is required");
    }
}

public class UpdateProductToppingsRequestValidator : AbstractValidator<UpdateProductToppingsRequest>
{
    public UpdateProductToppingsRequestValidator()
    {
        RuleForEach(x => x.Toppings).SetValidator(new ProductToppingRequestValidator());
    }
}
