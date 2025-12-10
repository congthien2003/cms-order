using Domain.Identity;
using Domain.Repositories;

namespace Infrastructures.Repositories.Implementations
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
        }

        //public async Task<(IEnumerable<Role> Result, int TotalCount)> GetListWithCountAsync(
        //    GetListParameters parameters,
        //    bool trackChanges,
        //    CancellationToken cancellationToken)
        //{
        //    var query = trackChanges
        //        ? _applicationDbContext.Roles
        //        : _applicationDbContext.Roles.AsNoTracking();

        //    // Searching
        //    if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
        //    {
        //        var term = parameters.SearchTerm.ToLower();
        //        query = query.Where(r =>
        //            r.Name.ToLower().Contains(term) ||
        //            (r.Description != null && r.Description.ToLower().Contains(term)));
        //    }

        //    // Total count after search
        //    var totalCount = await query.CountAsync(cancellationToken);

        //    // Sorting
        //    if (!string.IsNullOrWhiteSpace(parameters.SortBy))
        //    {
        //        query = parameters.SortBy.ToLower() switch
        //        {
        //            "name" => parameters.SortDescending ? query.OrderByDescending(r => r.Name) : query.OrderBy(r => r.Name),
        //            "createdat" => parameters.SortDescending ? query.OrderByDescending(r => r.CreatedAt) : query.OrderBy(r => r.CreatedAt),
        //            _ => query.OrderBy(r => r.CreatedAt)
        //        };
        //    }
        //    else
        //    {
        //        query = query.OrderBy(r => r.CreatedAt);
        //    }

        //    // Paging
        //    var roles = await query
        //        .Skip((parameters.Page - 1) * parameters.PageSize)
        //        .Take(parameters.PageSize)
        //        .ToListAsync(cancellationToken);

        //    return (roles, totalCount);
        //}
    }
}
