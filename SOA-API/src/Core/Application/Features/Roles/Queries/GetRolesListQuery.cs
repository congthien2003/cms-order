using Application.Models.Common;
using Application.Models.Role;
using Domain.Repositories;
using MapsterMapper;
using MediatR;

namespace Application.Features.Roles.Queries
{
    public class GetRolesListQuery : IRequest<Result<PagedResult<RoleInfoResponse>>>
    {
        public GetListParameters Parameters { get; set; }

        public GetRolesListQuery(GetListParameters parameters)
        {
            Parameters = parameters;
        }
    }

    public class GetRolesListQueryHandler : IRequestHandler<GetRolesListQuery, Result<PagedResult<RoleInfoResponse>>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetRolesListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<PagedResult<RoleInfoResponse>>> Handle(GetRolesListQuery request, CancellationToken cancellationToken)
        {
            //var pagedRoles = await _repositoryManager.RoleRepository.GetListWithCountAsync(request.Parameters, false, cancellationToken);

            //var mapped = _mapper.Map<IReadOnlyList<RoleInfoResponse>>(pagedRoles.Result);
            var result = new PagedResult<RoleInfoResponse>(
                new List<RoleInfoResponse>(),
                0,
                request.Parameters.Page,
                request.Parameters.PageSize,
                (int)Math.Ceiling(0 / (double)request.Parameters.PageSize)
            );

            return Result<PagedResult<RoleInfoResponse>>.Success("Get list role success", result);
        }
    }
}
