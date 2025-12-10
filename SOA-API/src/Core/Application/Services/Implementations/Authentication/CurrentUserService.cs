using Application.Services.Interfaces.Authentication;
using Microsoft.AspNetCore.Http;
using Shared.Auth;
using System.Security.Claims;


namespace Application.Services.Implementations.Authentication
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? UserId =>
            _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        public CurrentUser CurrentUser => new CurrentUser
        {
            Id = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value.ToString() ?? string.Empty),
            Username = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty,
            Role = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty,
            Permissions = _httpContextAccessor.HttpContext?.User?.FindFirst("Permissions")?.Value ?? string.Empty,
        };
    }
}
