using FluentValidation;
using Application.Features.Toppings.Models;

namespace Application.Features.Toppings.Validators;

public class UpdateToppingRequestValidator : AbstractValidator<UpdateToppingRequest>
{
    public UpdateToppingRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Topping name is required")
            .MaximumLength(200).WithMessage("Topping name cannot exceed 200 characters");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be greater than or equal to 0");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be greater than or equal to 0");
    }
}
