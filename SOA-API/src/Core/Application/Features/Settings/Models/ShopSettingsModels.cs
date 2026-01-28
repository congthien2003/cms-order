using System.ComponentModel.DataAnnotations;

namespace Application.Features.Settings.Models;

/// <summary>
/// Response DTO for Shop Settings
/// </summary>
public class ShopSettingsResponse
{
    public Guid Id { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public decimal DefaultVATPercentage { get; set; }
    public bool IsVATEnabled { get; set; }
    public string? ReceiptFooter { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Request DTO for updating Shop Settings
/// </summary>
public class UpdateShopSettingsRequest
{
    [Required]
    [MaxLength(200)]
    public string ShopName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Phone]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Logo { get; set; }

    [Range(0, 100)]
    public decimal DefaultVATPercentage { get; set; } = 10;

    public bool IsVATEnabled { get; set; } = true;

    [MaxLength(500)]
    public string? ReceiptFooter { get; set; }
}
