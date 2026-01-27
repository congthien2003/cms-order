using Application.Features.ShopSettings.Models;
using FluentValidation;

namespace Application.Features.ShopSettings.Validators
{
    public class UpdateReceiptFooterRequestValidator : AbstractValidator<UpdateReceiptFooterRequest>
    {
        public UpdateReceiptFooterRequestValidator()
        {
            RuleFor(x => x.ReceiptFooter)
                .MaximumLength(1000).WithMessage("Receipt footer must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.ReceiptFooter));
        }
    }
}
