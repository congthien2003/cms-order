using Application.Services.Interfaces.Abstractions;
using Shared.Auth;
namespace Application.Services.Interfaces.Authentication
{
    public interface ICurrentUserService : ITransientService
    {
        public CurrentUser CurrentUser { get; }
    }
}
