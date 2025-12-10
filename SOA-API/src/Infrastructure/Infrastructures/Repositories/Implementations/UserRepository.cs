using Domain.Identity;
using Domain.Repositories;

namespace Infrastructures.Repositories.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
        }

        //public async Task<(IEnumerable<User> Result, int TotalCount)> GetListWithCountAsync(GetListParameters parameters,
        //                                                                                    bool trackChanges,
        //                                                                                    CancellationToken cancellationToken)
        //{
        //    var query = trackChanges
        //        ? _applicationDbContext.Users.Include(x => x.Roles)
        //        : _applicationDbContext.Users.Include(x => x.Roles).AsNoTracking();

        //    // Filtering
        //    if (parameters.IsActive.HasValue)
        //        query = query.Where(u => u.IsActive == parameters.IsActive.Value);

        //    // Searching
        //    if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
        //    {
        //        var term = parameters.SearchTerm.ToLower();
        //        query = query.Where(u =>
        //            u.UserName.ToLower().Contains(term) ||
        //            u.Email.ToLower().Contains(term));
        //    }

        //    // Total count after filter/search
        //    var totalCount = await query.CountAsync(cancellationToken);

        //    // Sorting
        //    if (!string.IsNullOrWhiteSpace(parameters.SortBy))
        //    {
        //        query = parameters.SortBy.ToLower() switch
        //        {
        //            "username" => parameters.SortDescending ? query.OrderByDescending(u => u.UserName) : query.OrderBy(u => u.UserName),
        //            "email" => parameters.SortDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
        //            "createdat" => parameters.SortDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt),
        //            _ => query.OrderByDescending(u => u.CreatedAt)
        //        };
        //    }
        //    else
        //    {
        //        query = query.OrderByDescending(u => u.CreatedAt);
        //    }

        //    // Paging
        //    var users = await query
        //        .Skip((parameters.Page - 1) * parameters.PageSize)
        //        .Take(parameters.PageSize)
        //        .ToListAsync(cancellationToken);

        //    return (users, totalCount);
        //}
    }
}
