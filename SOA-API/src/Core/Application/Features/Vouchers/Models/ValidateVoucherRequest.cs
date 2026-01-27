namespace Application.Features.Vouchers.Models;

public class ValidateVoucherRequest
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderAmount { get; set; }
}
