using Application.Models.Common;
using Application.Models.User.Response;
using Domain.Repositories;
using MapsterMapper;
using MediatR;

namespace Application.Features.Users.Queries
{
    public class GetUsersListQuery : IRequest<Result<PagedResult<UserInfoResponse>>>
    {
        public GetListParameters Parameters { get; set; }

        public GetUsersListQuery(GetListParameters parameters)
        {
            Parameters = parameters;
        }
    }

    public class GetUsersListQueryHandler : IRequestHandler<GetUsersListQuery, Result<PagedResult<UserInfoResponse>>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetUsersListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<PagedResult<UserInfoResponse>>> Handle(GetUsersListQuery request, CancellationToken cancellationToken)
        {
            //var pagedUsers = await _repositoryManager.UserRepository.GetListWithCountAsync(request.Parameters, false, cancellationToken);

            //var mapped = _mapper.Map<IReadOnlyList<UserInfoResponse>>(pagedUsers.Result);

            var result = new PagedResult<UserInfoResponse>(
                new List<UserInfoResponse>(),
                0,
                request.Parameters.Page,
                request.Parameters.PageSize,
                (int)Math.Ceiling(0 / (double)request.Parameters.PageSize)
            );
            return Result<PagedResult<UserInfoResponse>>.Success("Get list user success", result);
        }
    }
}
