namespace Application.Features.ShopSettings.Models
{
    /// <summary>
    /// Request model for updating receipt footer
    /// </summary>
    public class UpdateReceiptFooterRequest
    {
        public string? ReceiptFooter { get; set; }
    }
}
