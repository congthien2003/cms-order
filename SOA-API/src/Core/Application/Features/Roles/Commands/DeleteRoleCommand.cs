using Application.Models.Common;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Roles.Commands
{
    public class DeleteRoleCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }

        public DeleteRoleCommand(Guid id)
        {
            Id = id;
        }
    }

    public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public DeleteRoleCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _repositoryManager.RoleRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (role == null)
                throw new NotFoundException("Role not found", "NOT-FOUND");

            await _repositoryManager.RoleRepository.DeleteAsync(role);
            await _repositoryManager.SaveAsync(cancellationToken);

            return Result<bool>.Success("Delete role successful", true);
        }
    }
}
