using FluentValidation;
using Application.Features.Vouchers.Models;
using Domain.Entities.Enums;

namespace Application.Features.Vouchers.Validators;

public class CreateVoucherRequestValidator : AbstractValidator<CreateVoucherRequest>
{
    public CreateVoucherRequestValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Voucher code is required")
            .MaximumLength(50).WithMessage("Voucher code cannot exceed 50 characters")
            .Matches("^[A-Z0-9_-]+$").WithMessage("Voucher code can only contain uppercase letters, numbers, hyphens and underscores");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Voucher name is required")
            .MaximumLength(200).WithMessage("Voucher name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.DiscountValue)
            .GreaterThan(0).WithMessage("Discount value must be greater than 0");

        RuleFor(x => x.DiscountValue)
            .LessThanOrEqualTo(100).WithMessage("Percentage discount cannot exceed 100%")
            .When(x => x.DiscountType == DiscountType.Percentage);

        RuleFor(x => x.MinOrderAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum order amount must be greater than or equal to 0")
            .When(x => x.MinOrderAmount.HasValue);

        RuleFor(x => x.MaxDiscountAmount)
            .GreaterThan(0).WithMessage("Maximum discount amount must be greater than 0")
            .When(x => x.MaxDiscountAmount.HasValue);

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.UsageLimit)
            .GreaterThan(0).WithMessage("Usage limit must be greater than 0")
            .When(x => x.UsageLimit.HasValue);
    }
}
