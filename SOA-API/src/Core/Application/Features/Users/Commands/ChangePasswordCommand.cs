using Application.Models.Authentication.Request;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;
using Shared.Helpers;

namespace Application.Features.Users.Commands
{
    public class ChangePasswordCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public ChangePasswordRequest Request { get; set; }

        public ChangePasswordCommand(Guid id, ChangePasswordRequest request)
        {
            Id = id;
            Request = request;
        }
    }

    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public ChangePasswordCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            if (request.Request.OldPassword != request.Request.NewPassword)
            {
                throw new ValidationException("Old and new passwords not match", "INVALID-PASSWORDS");
            }

            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");

            var salt = Convert.FromBase64String(user.Salting);
            var validated = Hashing.VerifyPassword(request.Request.OldPassword, user.PasswordHash, salt);

            if (!validated)
            {
                throw new ValidationException("Old password is incorrect", "INVALID-OLD-PASSWORD");
            }

            if (string.IsNullOrWhiteSpace(request.Request.NewPassword) || request.Request.NewPassword.Length < 6)
            {
                throw new ValidationException("New password must be at least 6 characters long", "INVALID-NEW-PASSWORD");
            }

            user.PasswordHash = Hashing.HashPassword(request.Request.NewPassword, out var newSalt);
            user.Salting = Convert.ToBase64String(newSalt);

            await _repositoryManager.UserRepository.UpdateAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);

            return Result<bool>.Success("Change password successful", true);
        }
    }
}
