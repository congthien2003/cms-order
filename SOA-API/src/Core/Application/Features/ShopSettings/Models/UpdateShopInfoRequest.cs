namespace Application.Features.ShopSettings.Models
{
    /// <summary>
    /// Request model for updating shop information
    /// </summary>
    public class UpdateShopInfoRequest
    {
        public string ShopName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Logo { get; set; }
    }
}
