namespace Application.Features.Toppings.Models;

public class CreateToppingRequest
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; } = 0;
}
