using Application.Exceptions;
using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Commands;

/// <summary>
/// Command to create a new order with items and toppings
/// </summary>
public record CreateOrderCommand(CreateOrderRequest Request) : IRequest<Result<OrderDetailResponse>>;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Result<OrderDetailResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public CreateOrderCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<OrderDetailResponse>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // 1. Generate order number
        var orderNumber = await _repositoryManager.OrderRepository
            .GenerateOrderNumberAsync(cancellationToken);

        // 2. Create order
        var order = new Order(
            orderNumber,
            request.Request.PaymentMethod,
            request.Request.CustomerName,
            request.Request.CustomerPhone,
            request.Request.Note
        );

        await _repositoryManager.OrderRepository.AddAsync(order);

        // 3. Process order items
        decimal subTotal = 0;

        foreach (var itemRequest in request.Request.Items)
        {
            // Get product with details
            var product = await _repositoryManager.ProductRepository
                .GetWithDetailsAsync(itemRequest.ProductId, false, cancellationToken);

            if (product == null)
                throw new NotFoundException($"Product with ID {itemRequest.ProductId} not found", "PRODUCT.NOTFOUND");

            if (!product.IsActive)
                throw new BadRequestException($"Product '{product.Name}' is not available", "PRODUCT.INACTIVE");

            // Calculate unit price (base price + size adjustment)
            decimal unitPrice = product.BasePrice;
            string? sizeName = null;

            if (itemRequest.ProductSizeId.HasValue)
            {
                var size = product.Sizes.FirstOrDefault(s => s.Id == itemRequest.ProductSizeId.Value);
                if (size == null)
                    throw new NotFoundException($"Product size not found", "PRODUCTSIZE.NOTFOUND");

                if (!size.IsActive)
                    throw new BadRequestException($"Size '{size.SizeName}' is not available", "PRODUCTSIZE.INACTIVE");

                unitPrice += size.PriceAdjustment;
                sizeName = size.SizeName;
            }

            // Create order item
            var orderItem = new OrderItem(
                order.Id,
                product.Id,
                product.Name,
                itemRequest.Quantity,
                unitPrice,
                itemRequest.ProductSizeId,
                sizeName,
                itemRequest.Note
            );

            order.Items.Add(orderItem);

            // Process toppings
            decimal toppingTotal = 0;

            if (itemRequest.Toppings != null && itemRequest.Toppings.Any())
            {
                foreach (var toppingRequest in itemRequest.Toppings)
                {
                    var topping = await _repositoryManager.ToppingRepository
                        .GetByIdAsync(toppingRequest.ToppingId, false, cancellationToken);

                    if (topping == null)
                        throw new NotFoundException($"Topping with ID {toppingRequest.ToppingId} not found", "TOPPING.NOTFOUND");

                    if (!topping.IsActive)
                        throw new BadRequestException($"Topping '{topping.Name}' is not available", "TOPPING.INACTIVE");

                    var orderItemTopping = new OrderItemTopping(
                        orderItem.Id,
                        topping.Id,
                        topping.Name,
                        topping.Price,
                        toppingRequest.Quantity
                    );

                    orderItem.Toppings.Add(orderItemTopping);
                    toppingTotal += orderItemTopping.CalculateTotal() * itemRequest.Quantity;
                }

                orderItem.UpdateToppingTotal(toppingTotal);
            }

            subTotal += orderItem.ItemTotal;
        }

        // 4. Apply voucher if provided
        decimal discountAmount = 0;
        Voucher? appliedVoucher = null;

        if (!string.IsNullOrWhiteSpace(request.Request.VoucherCode))
        {
            appliedVoucher = await _repositoryManager.VoucherRepository
                .GetByCodeAsync(request.Request.VoucherCode, true, cancellationToken);

            if (appliedVoucher != null && appliedVoucher.IsValid(subTotal, out _))
            {
                discountAmount = appliedVoucher.CalculateDiscount(subTotal);
                order.ApplyVoucher(appliedVoucher.Id, appliedVoucher.Code, discountAmount);
                appliedVoucher.IncrementUsage();
            }
        }

        // 5. Get VAT settings
        var shopSettings = await _repositoryManager.ShopSettingRepository
            .GetSettingsAsync(false, cancellationToken);

        decimal? vatPercentage = shopSettings?.IsVATEnabled == true ? shopSettings.DefaultVATPercentage : null;

        // 6. Calculate totals
        order.RecalculateTotals(subTotal, discountAmount, vatPercentage);

        // 7. Save order
        await _repositoryManager.SaveAsync(cancellationToken);

        // 8. Build response
        var response = BuildOrderDetailResponse(order);

        return Result<OrderDetailResponse>.Success("Order created successfully", response);
    }

    private static OrderDetailResponse BuildOrderDetailResponse(Order order)
    {
        return new OrderDetailResponse
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            SubTotal = order.SubTotal,
            DiscountAmount = order.DiscountAmount,
            VATPercentage = order.VATPercentage,
            VATAmount = order.VATAmount,
            IsVATIncluded = order.IsVATIncluded,
            TotalAmount = order.TotalAmount,
            VoucherId = order.VoucherId,
            VoucherCode = order.VoucherCode,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            PaymentStatus = order.PaymentStatus,
            Note = order.Note,
            ItemCount = order.Items.Count,
            CreatedDate = order.CreatedAt,
            ModifiedDate = order.UpdatedAt,
            Items = order.Items.Select(item => new OrderItemResponse
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                ProductSizeId = item.ProductSizeId,
                SizeName = item.SizeName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                ToppingTotal = item.ToppingTotal,
                ItemTotal = item.ItemTotal,
                Note = item.Note,
                Toppings = item.Toppings.Select(t => new OrderItemToppingResponse
                {
                    Id = t.Id,
                    ToppingId = t.ToppingId,
                    ToppingName = t.ToppingName,
                    Price = t.Price,
                    Quantity = t.Quantity
                }).ToList()
            }).ToList()
        };
    }
}
