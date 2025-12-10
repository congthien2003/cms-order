using Application.Models.Common;
using Application.Models.Role;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Roles.Commands
{
    public class UpdateRoleCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public UpdateRoleRequest Request { get; set; }

        public UpdateRoleCommand(Guid id, UpdateRoleRequest request)
        {
            Id = id;
            Request = request;
        }
    }

    public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public UpdateRoleCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _repositoryManager.RoleRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (role == null)
                throw new NotFoundException("Role not found", "NOT-FOUND");

            role.Update(request.Request.Name, request.Request.Description);

            await _repositoryManager.RoleRepository.UpdateAsync(role);
            await _repositoryManager.SaveAsync(cancellationToken);

            return Result<bool>.Success("Update role successful", true);
        }
    }
}
