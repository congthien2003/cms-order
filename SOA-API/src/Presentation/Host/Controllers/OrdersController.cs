using Application.Features.Orders.Commands;
using Application.Features.Orders.Models;
using Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers;

/// <summary>
/// Controller for Order Management
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get paginated list of orders with filters
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] GetOrdersListParameters parameters, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetOrdersListQuery(parameters), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get order by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrderById(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get order by order number
    /// </summary>
    [HttpGet("number/{orderNumber}")]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetOrderByNumberQuery(orderNumber), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get orders in queue (Pending, Confirmed, Preparing, Ready)
    /// </summary>
    [HttpGet("queue")]
    public async Task<IActionResult> GetOrderQueue(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetOrderQueueQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get today's orders
    /// </summary>
    [HttpGet("today")]
    public async Task<IActionResult> GetTodayOrders(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetTodayOrdersQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Create a new order
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new CreateOrderCommand(request), cancellationToken);
        return CreatedAtAction(nameof(GetOrderById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Update order status
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, request), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Update payment status
    /// </summary>
    [HttpPatch("{id:guid}/payment")]
    public async Task<IActionResult> UpdatePaymentStatus(Guid id, [FromBody] UpdatePaymentStatusRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new UpdatePaymentStatusCommand(id, request), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Cancel an order
    /// </summary>
    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id, [FromBody] CancelOrderRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new CancelOrderCommand(id, request), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get order receipt for printing
    /// </summary>
    [HttpGet("{id:guid}/receipt")]
    public async Task<IActionResult> GetReceipt(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetOrderReceiptQuery(id), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Quick actions - Confirm order
    /// </summary>
    [HttpPost("{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmOrder(Guid id, CancellationToken cancellationToken = default)
    {
        var request = new UpdateOrderStatusRequest { Status = Domain.Entities.Enums.OrderStatus.Confirmed };
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, request), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Quick actions - Start preparing order
    /// </summary>
    [HttpPost("{id:guid}/prepare")]
    public async Task<IActionResult> PrepareOrder(Guid id, CancellationToken cancellationToken = default)
    {
        var request = new UpdateOrderStatusRequest { Status = Domain.Entities.Enums.OrderStatus.Preparing };
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, request), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Quick actions - Mark order as ready
    /// </summary>
    [HttpPost("{id:guid}/ready")]
    public async Task<IActionResult> MarkOrderReady(Guid id, CancellationToken cancellationToken = default)
    {
        var request = new UpdateOrderStatusRequest { Status = Domain.Entities.Enums.OrderStatus.Ready };
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, request), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Quick actions - Complete order
    /// </summary>
    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> CompleteOrder(Guid id, CancellationToken cancellationToken = default)
    {
        var request = new UpdateOrderStatusRequest { Status = Domain.Entities.Enums.OrderStatus.Completed };
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, request), cancellationToken);
        return Ok(result);
    }
}
