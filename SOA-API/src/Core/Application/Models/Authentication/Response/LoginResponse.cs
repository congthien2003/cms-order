using Application.Models.User.Response;

namespace Application.Models.Authentication.Response
{
    public class LoginResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public UserInfoResponse User { get; set; } = null!;
    }
}
