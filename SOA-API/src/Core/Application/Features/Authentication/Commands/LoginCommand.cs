using Application.Models.Authentication.Request;
using Application.Models.Authentication.Response;
using Application.Models.Common;
using Application.Services.Interfaces.Authentication;
using MediatR;
using Application.Exceptions;
using Shared.Helpers;
using Domain.Repositories;

namespace Application.Features.Authentication.Commands
{
    public class LoginCommand : IRequest<Result<LoginResponse>>
    {
        public LoginRequest Request { get; set; }

        public LoginCommand(LoginRequest request)
        {
            Request = request;
        }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
    {
        private readonly IJwtManager _jwtManager;
        private readonly IRepositoryManager _repositoryManager;

        public LoginCommandHandler(IJwtManager jwtManager, IRepositoryManager repositoryManager)
        {
            _jwtManager = jwtManager;
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var users = await _repositoryManager.UserRepository.FindByConditionAsync(
                u => u.Email == request.Request.Email,
                false,
                cancellationToken
            );

            var user = users.FirstOrDefault();
            if (user == null)
            {
                throw new NotFoundException("User not found", "NOT-FOUND");
            }

            if (user.IsDeleted)
            {
                throw new ValidationException("User is deleted", "USER-DELETED");
            }

            if (user.IsActive == false)
            {
                throw new ValidationException("User has been blocked", "USER-NOT-ACTIVE");
            }

            if (user.IsEmailConfirmed)
            {
                throw new ValidationException("Email is not confirmed", "EMAIL-NOT-CONFIRMED");
            }

            var salt = Convert.FromBase64String(user.Salting);
            var validated = Hashing.VerifyPassword(request.Request.Password, user.PasswordHash, salt);

            if (!validated)
            {
                throw new ValidationException("Password is incorrect", "INVALID-PASSWORD");
            }

            string accessToken = _jwtManager.GenerateToken(user);

            return Result<LoginResponse>.Success("Login successful.", new LoginResponse
            {
                AccessToken = accessToken
            });
        }
    }
}
