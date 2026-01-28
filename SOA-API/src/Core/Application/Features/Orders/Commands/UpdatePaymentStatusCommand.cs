using Application.Exceptions;
using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Commands;

/// <summary>
/// Command to update payment status
/// </summary>
public record UpdatePaymentStatusCommand(Guid Id, UpdatePaymentStatusRequest Request) : IRequest<Result<OrderResponse>>;

public class UpdatePaymentStatusCommandHandler : IRequestHandler<UpdatePaymentStatusCommand, Result<OrderResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public UpdatePaymentStatusCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<OrderResponse>> Handle(UpdatePaymentStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _repositoryManager.OrderRepository
            .GetWithDetailsAsync(request.Id, true, cancellationToken);

        if (order == null)
            throw new NotFoundException($"Order with ID {request.Id} not found", "ORDER.NOTFOUND");

        order.UpdatePaymentStatus(request.Request.PaymentStatus);

        // If payment is completed and order is ready, complete the order
        if (request.Request.PaymentStatus == PaymentStatus.Paid && order.Status == OrderStatus.Ready)
        {
            order.Complete();
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

        return Result<OrderResponse>.Success("Payment status updated successfully", response);
    }
}
