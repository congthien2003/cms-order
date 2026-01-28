namespace Application.Features.Products.Models;

/// <summary>
/// Response DTO for Product Size
/// </summary>
public class ProductSizeResponse
{
    public Guid Id { get; set; }
    public string SizeName { get; set; } = string.Empty;
    public decimal PriceAdjustment { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>
/// Response DTO for Product Topping mapping
/// </summary>
public class ProductToppingResponse
{
    public Guid ToppingId { get; set; }
    public string ToppingName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsDefault { get; set; }
    public string? ImageUrl { get; set; }
}

/// <summary>
/// Basic Product Response DTO (for list views)
/// </summary>
public class ProductResponse
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

/// <summary>
/// Detailed Product Response DTO (includes sizes and toppings)
/// </summary>
public class ProductDetailResponse : ProductResponse
{
    public ICollection<ProductSizeResponse> Sizes { get; set; } = new List<ProductSizeResponse>();
    public ICollection<ProductToppingResponse> AvailableToppings { get; set; } = new List<ProductToppingResponse>();
}
