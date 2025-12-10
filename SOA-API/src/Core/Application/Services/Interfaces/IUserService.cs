using Application.Models.Authentication.Request;
using Application.Models.Common;
using Application.Models.User.Request;
using Application.Models.User.Response;

namespace Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<Result<UserDetailResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<Result<UserInfoResponse>> GetByUsernameAsync(string username, CancellationToken cancellationToken);
        Task<Result<UserInfoResponse>> GetByEmailAsync(string email, CancellationToken cancellationToken);
        Task<Result<PagedResult<UserInfoResponse>>> GetListWithPaginationAsync(
            GetListParameters request,
            CancellationToken cancellationToken
        );
        Task<Result<Guid>> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> UpdateAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task<Result<bool>> ChangePasswordAsync(Guid id, ChangePasswordRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> AssignRoleAsync(Guid id, Guid roleId, CancellationToken cancellationToken);
        Task<Result<bool>> RemoveRoleAsync(Guid id, Guid roleId, CancellationToken cancellationToken);
        Task<Result<bool>> DeactivateUserAsync(Guid id, CancellationToken cancellationToken);
        Task<Result<bool>> ActivateUserAsync(Guid id, CancellationToken cancellationToken);
    }
}
