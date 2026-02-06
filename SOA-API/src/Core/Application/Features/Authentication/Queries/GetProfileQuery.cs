using Application.Exceptions;
using Application.Models.Common;
using Application.Models.User.Response;
using Application.Services.Interfaces.Authentication;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Authentication.Queries
{
    /// <summary>
    /// Query to get the current authenticated user's profile
    /// </summary>
    public record GetProfileQuery : IRequest<Result<UserInfoResponse>>;

    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, Result<UserInfoResponse>>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IRepositoryManager _repositoryManager;

        public GetProfileQueryHandler(
            ICurrentUserService currentUserService,
            IRepositoryManager repositoryManager)
        {
            _currentUserService = currentUserService;
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<UserInfoResponse>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            var currentUser = _currentUserService.CurrentUser;
            
            if (currentUser.Id == Guid.Empty)
            {
                throw new UnauthorizedException("User not authenticated", "UNAUTHENTICATED");
            }

            var user = await _repositoryManager.UserRepository.GetByIdAsync(currentUser.Id, false, cancellationToken);

            if (user == null || user.IsDeleted)
            {
                throw new NotFoundException("User not found", "USER-NOT-FOUND");
            }

            var userInfo = new UserInfoResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                IsEmailConfirmed = user.IsEmailConfirmed,
                PhoneNumber = user.PhoneNumber,
                IsPhoneNumberConfirmed = user.IsPhoneNumberConfirmed,
                LastLoginAt = user.LastLoginAt,
                Roles = user.Roles?.Select(r => r.Name).ToList() ?? new List<string>(),
                ProfilePictureUrl = user.ProfilePictureUrl,
                IsActive = user.IsActive
            };

            return Result<UserInfoResponse>.Success("Profile retrieved successfully", userInfo);
        }
    }
}
