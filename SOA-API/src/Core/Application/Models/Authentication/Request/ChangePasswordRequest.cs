namespace Application.Models.Authentication.Request
{
    public class ChangePasswordRequest
    {
        public required string OldPassword { get; set; } = string.Empty;
        public required string NewPassword { get; set; } = string.Empty;
        public required string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
