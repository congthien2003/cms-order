using Application.Models.Common;
using Application.Models.Role;
using Domain.Repositories;
using MapsterMapper;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Roles.Queries
{
    public class GetRoleByNameQuery : IRequest<Result<RoleInfoResponse>>
    {
        public string RoleName { get; set; }

        public GetRoleByNameQuery(string roleName)
        {
            RoleName = roleName;
        }
    }

    public class GetRoleByNameQueryHandler : IRequestHandler<GetRoleByNameQuery, Result<RoleInfoResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetRoleByNameQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<RoleInfoResponse>> Handle(GetRoleByNameQuery request, CancellationToken cancellationToken)
        {
            var roles = await _repositoryManager.RoleRepository.FindByConditionAsync(
                r => r.Name.Equals(request.RoleName, StringComparison.OrdinalIgnoreCase),
                false,
                cancellationToken
            );

            var role = roles.FirstOrDefault();
            if (role == null)
                throw new NotFoundException("Role not found", "NOT-FOUND");

            var response = _mapper.Map<RoleInfoResponse>(role);
            return Result<RoleInfoResponse>.Success("Get by name success", response);
        }
    }
}
