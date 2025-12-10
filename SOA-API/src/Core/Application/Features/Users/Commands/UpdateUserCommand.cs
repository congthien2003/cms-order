using Application.Models.Common;
using Application.Models.User.Request;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Commands
{
    public class UpdateUserCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public UpdateUserRequest Request { get; set; }

        public UpdateUserCommand(Guid id, UpdateUserRequest request)
        {
            Id = id;
            Request = request;
        }
    }

    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public UpdateUserCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");
            
            user.FullName = request.Request.FullName;
            user.PhoneNumber = request.Request.PhoneNumber;
            user.ProfilePictureUrl = request.Request.ProfilePictureUrl;
            user.IsEmailConfirmed = request.Request.IsEmailConfirmed;
            user.IsPhoneNumberConfirmed = request.Request.IsPhoneNumberConfirmed;

            var roles = await _repositoryManager.RoleRepository.FindByConditionAsync(
                r => request.Request.RoleIds.Contains(r.Id),
                true,
                cancellationToken
            );
            foreach (var role in roles)
            {
                user.AddRole(role);
            }

            await _repositoryManager.UserRepository.UpdateAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<bool>.Success("Update user successful", true);
        }
    }
}
