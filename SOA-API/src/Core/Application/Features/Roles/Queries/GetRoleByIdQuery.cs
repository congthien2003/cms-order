using Application.Models.Common;
using Application.Models.Role;
using Domain.Repositories;
using MapsterMapper;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Roles.Queries
{
    public class GetRoleByIdQuery : IRequest<Result<RoleInfoResponse>>
    {
        public Guid Id { get; set; }

        public GetRoleByIdQuery(Guid id)
        {
            Id = id;
        }
    }

    public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, Result<RoleInfoResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetRoleByIdQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<RoleInfoResponse>> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
        {
            var role = await _repositoryManager.RoleRepository.GetByIdAsync(request.Id, false, cancellationToken);
            if (role == null)
                throw new NotFoundException("Role not found", "NOT-FOUND");

            var response = _mapper.Map<RoleInfoResponse>(role);
            return Result<RoleInfoResponse>.Success($"Get by Role {request.Id} success", response);
        }
    }
}
