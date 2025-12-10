using Application.Models.Common;
using Application.Models.User.Response;
using Domain.Repositories;
using MapsterMapper;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Queries
{
    public class GetUserByIdQuery : IRequest<Result<UserDetailResponse>>
    {
        public Guid Id { get; set; }

        public GetUserByIdQuery(Guid id)
        {
            Id = id;
        }
    }

    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, Result<UserDetailResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetUserByIdQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<UserDetailResponse>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.Id, false, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");
            
            var response = _mapper.Map<UserDetailResponse>(user);
            return Result<UserDetailResponse>.Success($"Get by User {request.Id} success", response);
        }
    }
}
