using System.ComponentModel.DataAnnotations;
using Domain.Entities.Enums;

namespace Application.Features.Orders.Models;

#region Request DTOs

/// <summary>
/// Request DTO for creating order item topping
/// </summary>
public class OrderItemToppingRequest
{
    [Required]
    public Guid ToppingId { get; set; }
    
    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
}

/// <summary>
/// Request DTO for creating order item
/// </summary>
public class OrderItemRequest
{
    [Required]
    public Guid ProductId { get; set; }
    
    public Guid? ProductSizeId { get; set; }
    
    [Required]
    [Range(1, 1000)]
    public int Quantity { get; set; }
    
    public string? Note { get; set; }
    
    public List<OrderItemToppingRequest>? Toppings { get; set; }
}

/// <summary>
/// Request DTO for creating a new order
/// </summary>
public class CreateOrderRequest
{
    public string? CustomerName { get; set; }
    
    [Phone]
    public string? CustomerPhone { get; set; }
    
    [Required]
    public PaymentMethod PaymentMethod { get; set; }
    
    public string? VoucherCode { get; set; }
    
    public string? Note { get; set; }
    
    [Required]
    [MinLength(1, ErrorMessage = "Order must have at least one item")]
    public List<OrderItemRequest> Items { get; set; } = new();
}

/// <summary>
/// Request DTO for updating order status
/// </summary>
public class UpdateOrderStatusRequest
{
    [Required]
    public OrderStatus Status { get; set; }
    
    public string? Reason { get; set; }
}

/// <summary>
/// Request DTO for updating payment status
/// </summary>
public class UpdatePaymentStatusRequest
{
    [Required]
    public PaymentStatus PaymentStatus { get; set; }
    
    public PaymentMethod? PaymentMethod { get; set; }
}

/// <summary>
/// Request DTO for cancelling order
/// </summary>
public class CancelOrderRequest
{
    public string? Reason { get; set; }
}

/// <summary>
/// Query parameters for getting orders list
/// </summary>
public class GetOrdersListParameters
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Search { get; set; }
    public OrderStatus? Status { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

#endregion
