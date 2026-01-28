using Domain.Entities.Enums;

namespace Application.Features.Orders.Models;

#region Response DTOs

/// <summary>
/// Response DTO for OrderItem Topping
/// </summary>
public class OrderItemToppingResponse
{
    public Guid Id { get; set; }
    public Guid ToppingId { get; set; }
    public string ToppingName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Total => Price * Quantity;
}

/// <summary>
/// Response DTO for OrderItem
/// </summary>
public class OrderItemResponse
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public Guid? ProductSizeId { get; set; }
    public string? SizeName { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal ToppingTotal { get; set; }
    public decimal ItemTotal { get; set; }
    public string? Note { get; set; }
    public ICollection<OrderItemToppingResponse> Toppings { get; set; } = new List<OrderItemToppingResponse>();
}

/// <summary>
/// Basic Order Response DTO (for list views)
/// </summary>
public class OrderResponse
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal VATAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string? VoucherCode { get; set; }
    public OrderStatus Status { get; set; }
    public string StatusDisplay => Status.ToString();
    public PaymentMethod PaymentMethod { get; set; }
    public string PaymentMethodDisplay => PaymentMethod.ToString();
    public PaymentStatus PaymentStatus { get; set; }
    public string PaymentStatusDisplay => PaymentStatus.ToString();
    public int ItemCount { get; set; }
    public DateTime CreatedDate { get; set; }
}

/// <summary>
/// Detailed Order Response DTO (includes items and toppings)
/// </summary>
public class OrderDetailResponse : OrderResponse
{
    public decimal VATPercentage { get; set; }
    public bool IsVATIncluded { get; set; }
    public Guid? VoucherId { get; set; }
    public string? Note { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public ICollection<OrderItemResponse> Items { get; set; } = new List<OrderItemResponse>();
}

/// <summary>
/// Receipt DTO for printing
/// </summary>
public class ReceiptResponse
{
    // Shop Info
    public string ShopName { get; set; } = string.Empty;
    public string ShopAddress { get; set; } = string.Empty;
    public string ShopPhone { get; set; } = string.Empty;
    
    // Order Info
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    
    // Items
    public ICollection<ReceiptItemResponse> Items { get; set; } = new List<ReceiptItemResponse>();
    
    // Totals
    public decimal SubTotal { get; set; }
    public string? VoucherCode { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal VATPercentage { get; set; }
    public decimal VATAmount { get; set; }
    public decimal TotalAmount { get; set; }
    
    // Payment
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    
    // Footer
    public string? ReceiptFooter { get; set; }
}

public class ReceiptItemResponse
{
    public string ProductName { get; set; } = string.Empty;
    public string? SizeName { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal ItemTotal { get; set; }
    public ICollection<string> Toppings { get; set; } = new List<string>();
}

#endregion
