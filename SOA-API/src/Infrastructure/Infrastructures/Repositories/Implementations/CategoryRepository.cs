using Domain.Entities;
using Domain.Repositories;
using Google;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories.Implementations
{
    /// <summary>
    /// Repository implementation for Category entity.
    /// Provides data access operations specific to Category.
    /// Implements the ICategoryRepository interface defined in the Domain layer.
    /// </summary>
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        /// <summary>
        /// Initializes a new instance of the CategoryRepository class.
        /// </summary>
        /// <param name="dbContext">The application database context</param>
        public CategoryRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
        }


        /// <summary>
        /// Retrieves a category by its name.
        /// </summary>
        /// <param name="name">The category name to search for</param>
        /// <param name="trackChanges">Whether to track changes for potential updates</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>The category if found; otherwise null</returns>
        public async Task<Category?> GetByNameAsync(string name, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _applicationDbContext.Set<Category>().AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(
                c => c.Name == name && !c.IsDeleted,
                cancellationToken);
        }

        /// <summary>
        /// Retrieves all active (non-deleted) categories.
        /// </summary>
        /// <param name="trackChanges">Whether to track changes for potential updates</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>List of active categories ordered by display order</returns>
        public async Task<IReadOnlyList<Category>> GetAllActiveAsync(bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _applicationDbContext.Set<Category>().Where(c => !c.IsDeleted);

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync(cancellationToken);
        }

        /// <summary>
        /// Checks if a category with the given name exists.
        /// </summary>
        /// <param name="name">The category name to check</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>True if category exists; otherwise false</returns>
        public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken)
        {
            return await _applicationDbContext.Set<Category>()
                .AnyAsync(
                    c => c.Name == name && !c.IsDeleted,
                    cancellationToken);
        }

        /// <summary>
        /// Checks if a category with the given name exists, excluding a specific category ID.
        /// Useful for update operations to allow keeping the same name.
        /// </summary>
        /// <param name="name">The category name to check</param>
        /// <param name="excludeId">The category ID to exclude from the check</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>True if category exists (excluding the specified ID); otherwise false</returns>
        public async Task<bool> ExistsByNameAsync(string name, Guid excludeId, CancellationToken cancellationToken)
        {
            return await _applicationDbContext.Set<Category>()
                .AnyAsync(
                    c => c.Name == name && c.Id != excludeId && !c.IsDeleted,
                    cancellationToken);
        }

        public async Task<(List<Category> categories, int totalCounts)> GetListAsync(int page, int pageSize, string search, bool isDeleted = false, CancellationToken cancellationToken = default)
        {
            var query = _applicationDbContext.Set<Category>().AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x => x.Name.Contains(search));
            }

            if (isDeleted)
            {
                query = query.Where(x => x.IsDeleted);
            }

            int totalCounts = await query.CountAsync(cancellationToken);

            var result = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            return (result, totalCounts);
        }
    }
}

