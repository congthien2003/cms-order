using Application.Models.Common;
using Application.Models.User.Response;
using Domain.Repositories;
using MapsterMapper;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Queries
{
    public class GetUserByUsernameQuery : IRequest<Result<UserInfoResponse>>
    {
        public string Username { get; set; }

        public GetUserByUsernameQuery(string username)
        {
            Username = username;
        }
    }

    public class GetUserByUsernameQueryHandler : IRequestHandler<GetUserByUsernameQuery, Result<UserInfoResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetUserByUsernameQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<UserInfoResponse>> Handle(GetUserByUsernameQuery request, CancellationToken cancellationToken)
        {
            var users = await _repositoryManager.UserRepository.FindByConditionAsync(
                u => u.UserName.Equals(request.Username, StringComparison.OrdinalIgnoreCase),
                false,
                cancellationToken
            );
            var user = users.FirstOrDefault();
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");
            
            var response = _mapper.Map<UserInfoResponse>(user);
            return Result<UserInfoResponse>.Success("Get by username success", response);
        }
    }
}
