namespace Application.Features.ShopSettings.Models
{
    /// <summary>
    /// Request model for updating VAT settings
    /// </summary>
    public class UpdateVATSettingsRequest
    {
        public decimal VATPercentage { get; set; }
        public bool IsVATEnabled { get; set; }
    }
}
