using System.ComponentModel.DataAnnotations;

namespace Application.Features.Products.Models;

/// <summary>
/// Request DTO for creating a new product size
/// </summary>
public class CreateProductSizeRequest
{
    [Required]
    [StringLength(50)]
    public string SizeName { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal PriceAdjustment { get; set; } = 0;

    public bool IsDefault { get; set; } = false;
}

/// <summary>
/// Request DTO for updating an existing product size
/// </summary>
public class UpdateProductSizeRequest
{
    [Required]
    [StringLength(50)]
    public string SizeName { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal PriceAdjustment { get; set; } = 0;

    public bool IsDefault { get; set; } = false;
}

/// <summary>
/// Request DTO for creating a new product
/// </summary>
public class CreateProductRequest
{
    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal BasePrice { get; set; }

    [Range(0, int.MaxValue)]
    public int SortOrder { get; set; } = 0;

    /// <summary>
    /// Optional: Create product with sizes
    /// </summary>
    public List<CreateProductSizeRequest>? Sizes { get; set; }
}

/// <summary>
/// Request DTO for updating an existing product
/// </summary>
public class UpdateProductRequest
{
    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal BasePrice { get; set; }

    [Range(0, int.MaxValue)]
    public int SortOrder { get; set; } = 0;
}

/// <summary>
/// Request DTO for managing product toppings
/// </summary>
public class ProductToppingRequest
{
    [Required]
    public Guid ToppingId { get; set; }
    public bool IsDefault { get; set; } = false;
}

/// <summary>
/// Request DTO for bulk updating product toppings
/// </summary>
public class UpdateProductToppingsRequest
{
    public List<ProductToppingRequest> Toppings { get; set; } = new();
}
