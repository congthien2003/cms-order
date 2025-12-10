using Application.Models.Common;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Commands
{
    public class AssignRoleCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }

        public AssignRoleCommand(Guid userId, Guid roleId)
        {
            UserId = userId;
            RoleId = roleId;
        }
    }

    public class AssignRoleCommandHandler : IRequestHandler<AssignRoleCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public AssignRoleCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(AssignRoleCommand request, CancellationToken cancellationToken)
        {
            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.UserId, true, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");

            var role = await _repositoryManager.RoleRepository.GetByIdAsync(request.RoleId, false, cancellationToken);

            if (!user.Roles.Contains(role))
            {
                user.AddRole(role);
            }

            await _repositoryManager.UserRepository.UpdateAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<bool>.Success("Assign role successful", true);
        }
    }
}
