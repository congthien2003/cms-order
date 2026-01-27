using Application.Features.ShopSettings.Models;
using FluentValidation;

namespace Application.Features.ShopSettings.Validators
{
    public class UpdateShopInfoRequestValidator : AbstractValidator<UpdateShopInfoRequest>
    {
        public UpdateShopInfoRequestValidator()
        {
            RuleFor(x => x.ShopName)
                .NotEmpty().WithMessage("Shop name is required")
                .MaximumLength(200).WithMessage("Shop name must not exceed 200 characters");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required")
                .MaximumLength(500).WithMessage("Address must not exceed 500 characters");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone is required")
                .MaximumLength(20).WithMessage("Phone must not exceed 20 characters")
                .Matches(@"^[0-9+\-\s()]+$").WithMessage("Phone number contains invalid characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Logo)
                .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.Logo));
        }
    }
}
