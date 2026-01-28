using Application.Exceptions;
using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Queries;

/// <summary>
/// Query to get order receipt for printing
/// </summary>
public record GetOrderReceiptQuery(Guid Id) : IRequest<Result<ReceiptResponse>>;

public class GetOrderReceiptQueryHandler : IRequestHandler<GetOrderReceiptQuery, Result<ReceiptResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetOrderReceiptQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ReceiptResponse>> Handle(GetOrderReceiptQuery request, CancellationToken cancellationToken)
    {
        var order = await _repositoryManager.OrderRepository
            .GetWithDetailsAsync(request.Id, false, cancellationToken);

        if (order == null)
            throw new NotFoundException($"Order with ID {request.Id} not found", "ORDER.NOTFOUND");

        // Get shop settings for shop info
        var shopSettings = await _repositoryManager.ShopSettingRepository
            .GetSettingsAsync(false, cancellationToken);

        var receipt = new ReceiptResponse
        {
            OrderNumber = order.OrderNumber,
            OrderDate = order.CreatedAt,
            ShopName = shopSettings?.ShopName ?? "Coffee Shop",
            ShopAddress = shopSettings?.Address ?? string.Empty,
            ShopPhone = shopSettings?.Phone ?? string.Empty,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            SubTotal = order.SubTotal,
            DiscountAmount = order.DiscountAmount,
            VoucherCode = order.VoucherCode,
            VATPercentage = order.VATPercentage,
            VATAmount = order.VATAmount,
            TotalAmount = order.TotalAmount,
            PaymentMethod = order.PaymentMethod.ToString(),
            PaymentStatus = order.PaymentStatus.ToString(),
            ReceiptFooter = shopSettings?.ReceiptFooter,
            Items = order.Items.Select(item => new ReceiptItemResponse
            {
                ProductName = item.ProductName,
                SizeName = item.SizeName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                ItemTotal = item.ItemTotal,
                Toppings = item.Toppings.Select(t => $"{t.ToppingName} x{t.Quantity}").ToList()
            }).ToList()
        };

        return Result<ReceiptResponse>.Success("Receipt generated successfully", receipt);
    }
}
