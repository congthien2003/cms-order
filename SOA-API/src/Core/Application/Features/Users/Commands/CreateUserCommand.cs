using Application.Models.Common;
using Application.Models.User.Request;
using Domain.Identity;
using Domain.Repositories;
using MediatR;
using Shared.Helpers;

namespace Application.Features.Users.Commands
{
    public class CreateUserCommand : IRequest<Result<Guid>>
    {
        public CreateUserRequest Request { get; set; }

        public CreateUserCommand(CreateUserRequest request)
        {
            Request = request;
        }
    }

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<Guid>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public CreateUserCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var passwordHash = Hashing.HashPassword(request.Request.Password, out var salting);
            var user = new User();
            
            var roles = await _repositoryManager.RoleRepository.FindByConditionAsync(
                r => request.Request.RoleIds.Contains(r.Id),
                true,
                cancellationToken
            );
            foreach (var role in roles)
            {
                user.AddRole(role);
            }

            await _repositoryManager.UserRepository.AddAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<Guid>.Success("Create user successful", user.Id);
        }
    }
}
