namespace Application.Features.ShopSettings.Models
{
    /// <summary>
    /// Response model for Shop Settings
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
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
