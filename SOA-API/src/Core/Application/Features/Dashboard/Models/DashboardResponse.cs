namespace Application.Features.Dashboard.Models;

#region Summary DTOs

/// <summary>
/// Dashboard summary response
/// </summary>
public class DashboardSummaryResponse
{
    // Today's statistics
    public decimal TodayRevenue { get; set; }
    public int TodayOrderCount { get; set; }
    public int TodayCompletedOrders { get; set; }
    public int TodayCancelledOrders { get; set; }
    
    // Pending orders
    public int PendingOrders { get; set; }
    public int PreparingOrders { get; set; }
    public int ReadyOrders { get; set; }
    
    // Comparison with yesterday
    public decimal YesterdayRevenue { get; set; }
    public decimal RevenueChangePercent { get; set; }
    public int YesterdayOrderCount { get; set; }
    public decimal OrderCountChangePercent { get; set; }
}

#endregion

#region Revenue DTOs

/// <summary>
/// Revenue statistics response
/// </summary>
public class RevenueStatisticsResponse
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public ICollection<DailyRevenueItem> DailyRevenue { get; set; } = new List<DailyRevenueItem>();
}

public class DailyRevenueItem
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

#endregion

#region Orders by Status DTOs

/// <summary>
/// Orders by status statistics
/// </summary>
public class OrdersByStatusResponse
{
    public int Pending { get; set; }
    public int Confirmed { get; set; }
    public int Preparing { get; set; }
    public int Ready { get; set; }
    public int Completed { get; set; }
    public int Cancelled { get; set; }
    public int Total { get; set; }
}

#endregion

#region Top Products DTOs

/// <summary>
/// Top selling products response
/// </summary>
public class TopProductsResponse
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public ICollection<TopProductItem> Products { get; set; } = new List<TopProductItem>();
}

public class TopProductItem
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? CategoryName { get; set; }
    public int QuantitySold { get; set; }
    public decimal Revenue { get; set; }
}

#endregion

#region Revenue by Category DTOs

/// <summary>
/// Revenue by category response
/// </summary>
public class RevenueByCategoryResponse
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalRevenue { get; set; }
    public ICollection<CategoryRevenueItem> Categories { get; set; } = new List<CategoryRevenueItem>();
}

public class CategoryRevenueItem
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public decimal Percentage { get; set; }
    public int OrderCount { get; set; }
}

#endregion

#region Report DTOs

/// <summary>
/// Report request parameters
/// </summary>
public class ReportParameters
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

/// <summary>
/// Comprehensive report response
/// </summary>
public class ReportResponse
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string ReportType { get; set; } = string.Empty; // Daily, Weekly, Monthly, Custom
    
    // Summary
    public decimal TotalRevenue { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal TotalVAT { get; set; }
    public decimal NetRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    
    // Breakdown
    public ICollection<DailyRevenueItem> DailyBreakdown { get; set; } = new List<DailyRevenueItem>();
    public ICollection<TopProductItem> TopProducts { get; set; } = new List<TopProductItem>();
    public ICollection<CategoryRevenueItem> RevenueByCategory { get; set; } = new List<CategoryRevenueItem>();
    public OrdersByStatusResponse OrdersByStatus { get; set; } = new();
    
    // Payment methods
    public ICollection<PaymentMethodStats> PaymentMethods { get; set; } = new List<PaymentMethodStats>();
}

public class PaymentMethodStats
{
    public string PaymentMethod { get; set; } = string.Empty;
    public int OrderCount { get; set; }
    public decimal Revenue { get; set; }
    public decimal Percentage { get; set; }
}

#endregion
