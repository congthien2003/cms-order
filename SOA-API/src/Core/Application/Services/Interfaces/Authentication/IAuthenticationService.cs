using Application.Services.Interfaces.Abstractions;
using Application.Models.Authentication.Request;
using Application.Models.Authentication.Response;
using Application.Models.Common;

namespace Application.Services.Interfaces.Authentication
{
    public interface IAuthenticationService : IScopedService
    {
        Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest request, CancellationToken token);
        Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken token);
        Task<Result> ChangePasswordAsync(ChangePasswordRequest changePassword);
        Task<Result> ForgetPasswordAsync(ForgotPasswordRequest forgotPassword);
        Task<Result> ResetPasswordAsync(ResetPasswordRequest resetPassword);
    }
}
