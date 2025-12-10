using Application.Models.Common;
using Application.Models.Role;

namespace Application.Services.Interfaces
{
    public interface IRoleService
    {
        Task<Result<RoleInfoResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<Result<RoleInfoResponse>> GetByNameAsync(string roleName, CancellationToken cancellationToken);
        Task<Result<PagedResult<RoleInfoResponse>>> GetListWithPaginationAsync(
            GetListParameters request,
            CancellationToken cancellationToken
        );
        Task<Result<Guid>> CreateAsync(CreateRoleRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> UpdateAsync(Guid id, UpdateRoleRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}
