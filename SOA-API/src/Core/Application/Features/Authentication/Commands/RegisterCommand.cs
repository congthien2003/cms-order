using Application.Models.Authentication.Request;
using Application.Models.Authentication.Response;
using Application.Models.Common;
using Domain.Identity;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;
using Shared.Helpers;

namespace Application.Features.Authentication.Commands
{
    public class RegisterCommand : IRequest<Result<RegisterResponse>>
    {
        public RegisterRequest Request { get; set; }

        public RegisterCommand(RegisterRequest request)
        {
            Request = request;
        }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<RegisterResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public RegisterCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<RegisterResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Request.Email) || string.IsNullOrWhiteSpace(request.Request.Password))
            {
                throw new ArgumentException("Email and password must be provided.");
            }

            var entity = new User
            {
                Email = request.Request.Email,
                PasswordHash = request.Request.Password
            };
            entity.PasswordHash = Hashing.HashPassword(entity.PasswordHash, out var salt);
            entity.Salting = Convert.ToBase64String(salt);

            await Task.CompletedTask;

            return Result<RegisterResponse>.Success("Register successfully", null);
        }
    }
}
