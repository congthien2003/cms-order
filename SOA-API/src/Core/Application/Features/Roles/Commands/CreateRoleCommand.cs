using Application.Models.Common;
using Application.Models.Role;
using Domain.Identity;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Roles.Commands
{
    public class CreateRoleCommand : IRequest<Result<Guid>>
    {
        public CreateRoleRequest Request { get; set; }

        public CreateRoleCommand(CreateRoleRequest request)
        {
            Request = request;
        }
    }

    public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, Result<Guid>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public CreateRoleCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<Guid>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
        {
            var role = Role.Create(request.Request.Name, request.Request.Description);
            await _repositoryManager.RoleRepository.AddAsync(role);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<Guid>.Success("Create role successful", role.Id);
        }
    }
}
