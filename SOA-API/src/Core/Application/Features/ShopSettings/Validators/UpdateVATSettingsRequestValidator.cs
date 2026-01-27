using Application.Features.ShopSettings.Models;
using FluentValidation;

namespace Application.Features.ShopSettings.Validators
{
    public class UpdateVATSettingsRequestValidator : AbstractValidator<UpdateVATSettingsRequest>
    {
        public UpdateVATSettingsRequestValidator()
        {
            RuleFor(x => x.VATPercentage)
                .GreaterThanOrEqualTo(0).WithMessage("VAT percentage must be greater than or equal to 0")
                .LessThanOrEqualTo(100).WithMessage("VAT percentage must be less than or equal to 100");
        }
    }
}
