using FluentValidation;
using Application.Features.Vouchers.Models;

namespace Application.Features.Vouchers.Validators;

public class ValidateVoucherRequestValidator : AbstractValidator<ValidateVoucherRequest>
{
    public ValidateVoucherRequestValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Voucher code is required");

        RuleFor(x => x.OrderAmount)
            .GreaterThan(0).WithMessage("Order amount must be greater than 0");
    }
}
