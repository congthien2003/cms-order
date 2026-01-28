using Application.Exceptions;
using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Commands;

/// <summary>
/// Command to cancel an order
/// </summary>
public record CancelOrderCommand(Guid Id, CancelOrderRequest Request) : IRequest<Result<OrderResponse>>;

public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, Result<OrderResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public CancelOrderCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<OrderResponse>> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _repositoryManager.OrderRepository
            .GetWithDetailsAsync(request.Id, true, cancellationToken);

        if (order == null)
            throw new NotFoundException($"Order with ID {request.Id} not found", "ORDER.NOTFOUND");

        // Cancel the order
        order.Cancel(request.Request.Reason);

        // If voucher was used, decrement the usage count
        if (order.VoucherId.HasValue)
        {
            var vouchers = await _repositoryManager.VoucherRepository
                .FindByConditionAsync(v => v.Id == order.VoucherId.Value, true, cancellationToken);
            
            var voucher = vouchers.FirstOrDefault();
            if (voucher != null)
            {
                voucher.DecrementUsage();
            }
        }

        await _repositoryManager.SaveAsync(cancellationToken);

        var response = new OrderResponse
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            SubTotal = order.SubTotal,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            PaymentStatus = order.PaymentStatus,
            ItemCount = order.Items.Count,
            CreatedDate = order.CreatedAt
        };

        return Result<OrderResponse>.Success("Order cancelled successfully", response);
    }
}
