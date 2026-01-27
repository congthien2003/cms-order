using Domain.Entities.Enums;

namespace Application.Features.Vouchers.Models;

public class VoucherResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    
    // Computed properties
    public bool IsValid => IsActive && DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate;
    public bool HasUsageLeft => !UsageLimit.HasValue || UsedCount < UsageLimit.Value;
    public bool CanBeUsed => IsValid && HasUsageLeft;
}
