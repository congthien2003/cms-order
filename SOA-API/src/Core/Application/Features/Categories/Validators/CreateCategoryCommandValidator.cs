using FluentValidation;

namespace Application.Features.Categories.Commands
{
    /// <summary>
    /// Validator for CreateCategoryCommand.
    /// Validates the request data before processing.
    /// </summary>
    public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
    {
        /// <summary>
        /// Initializes a new instance of the CreateCategoryCommandValidator class.
        /// Defines validation rules for category creation.
        /// </summary>
        public CreateCategoryCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Category name is required")
                .MaximumLength(100)
                .WithMessage("Category name cannot exceed 100 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description cannot exceed 500 characters");

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Display order must be non-negative");
        }
    }
}

