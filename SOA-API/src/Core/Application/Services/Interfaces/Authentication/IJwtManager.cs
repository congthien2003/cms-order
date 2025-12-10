using Domain.Identity;

namespace Application.Services.Interfaces.Authentication
{
    public interface IJwtManager
    {
        public string GenerateToken(User user);
        public bool ValidateToken(string token);
    }
}
