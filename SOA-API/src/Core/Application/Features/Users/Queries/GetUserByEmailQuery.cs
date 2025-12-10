using Application.Models.Common;
using Application.Models.User.Response;
using Domain.Repositories;
using MapsterMapper;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Queries
{
    public class GetUserByEmailQuery : IRequest<Result<UserInfoResponse>>
    {
        public string Email { get; set; }

        public GetUserByEmailQuery(string email)
        {
            Email = email;
        }
    }

    public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, Result<UserInfoResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetUserByEmailQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<UserInfoResponse>> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
        {
            var users = await _repositoryManager.UserRepository.FindByConditionAsync(
                u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase),
                false,
                cancellationToken
            );

            var user = users.FirstOrDefault();
            if (user == null)
            {
                throw new NotFoundException("User not found", "NOT-FOUND");
            }

            if (user.IsDeleted)
            {
                throw new ValidationException("User is deleted", "USER-DELETED");
            }

            if (user.IsActive == false)
            {
                throw new ValidationException("User has been blocked", "USER-NOT-ACTIVE");
            }

            if (user.IsEmailConfirmed)
            {
                throw new ValidationException("Email is not confirmed", "EMAIL-NOT-CONFIRMED");
            }

            var response = _mapper.Map<UserInfoResponse>(user);
            return Result<UserInfoResponse>.Success("Get by email success", response);
        }
    }
}
