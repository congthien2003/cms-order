using Application.Features.Orders.Models;
using FluentValidation;

namespace Application.Features.Orders.Validators;

/// <summary>
/// Validator for order item topping request
/// </summary>
public class OrderItemToppingRequestValidator : AbstractValidator<OrderItemToppingRequest>
{
    public OrderItemToppingRequestValidator()
    {
        RuleFor(x => x.ToppingId)
            .NotEmpty()
            .WithMessage("Topping ID is required");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity must be greater than 0");
    }
}

/// <summary>
/// Validator for order item request
/// </summary>
public class OrderItemRequestValidator : AbstractValidator<OrderItemRequest>
{
    public OrderItemRequestValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty()
            .WithMessage("Product ID is required");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity must be greater than 0");

        RuleForEach(x => x.Toppings)
            .SetValidator(new OrderItemToppingRequestValidator());
    }
}

/// <summary>
/// Validator for create order request
/// </summary>
public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.CustomerName)
            .MaximumLength(100)
            .WithMessage("Customer name must not exceed 100 characters");

        RuleFor(x => x.CustomerPhone)
            .MaximumLength(20)
            .WithMessage("Customer phone must not exceed 20 characters")
            .Matches(@"^[\d\s\+\-\(\)]*$")
            .When(x => !string.IsNullOrEmpty(x.CustomerPhone))
            .WithMessage("Invalid phone number format");

        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Order must have at least one item");

        RuleForEach(x => x.Items)
            .SetValidator(new OrderItemRequestValidator());

        RuleFor(x => x.VoucherCode)
            .MaximumLength(50)
            .WithMessage("Voucher code must not exceed 50 characters");

        RuleFor(x => x.Note)
            .MaximumLength(500)
            .WithMessage("Note must not exceed 500 characters");
    }
}

/// <summary>
/// Validator for update order status request
/// </summary>
public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Invalid order status");

        RuleFor(x => x.Reason)
            .MaximumLength(500)
            .WithMessage("Reason must not exceed 500 characters");
    }
}

/// <summary>
/// Validator for update payment status request
/// </summary>
public class UpdatePaymentStatusRequestValidator : AbstractValidator<UpdatePaymentStatusRequest>
{
    public UpdatePaymentStatusRequestValidator()
    {
        RuleFor(x => x.PaymentStatus)
            .IsInEnum()
            .WithMessage("Invalid payment status");

        RuleFor(x => x.PaymentMethod)
            .IsInEnum()
            .When(x => x.PaymentMethod.HasValue)
            .WithMessage("Invalid payment method");
    }
}

/// <summary>
/// Validator for cancel order request
/// </summary>
public class CancelOrderRequestValidator : AbstractValidator<CancelOrderRequest>
{
    public CancelOrderRequestValidator()
    {
        RuleFor(x => x.Reason)
            .MaximumLength(500)
            .WithMessage("Reason must not exceed 500 characters");
    }
}
