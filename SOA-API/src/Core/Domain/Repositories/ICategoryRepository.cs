using Domain.Entities;

namespace Domain.Repositories
{
    /// <summary>
    /// Repository interface for Category entity.
    /// Defines contracts for data access operations specific to Category.
    /// Follows Repository Pattern and DDD principles.
    /// </summary>
    public interface ICategoryRepository : IRepositoryBase<Category>
    {
        /// <summary>
        /// Gets a category by its name.
        /// </summary>
        /// <param name="name">The category name to search for</param>
        /// <param name="trackChanges">Whether to track changes for updates</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>The category if found; otherwise null</returns>
        Task<Category?> GetByNameAsync(string name, bool trackChanges, CancellationToken cancellationToken);

        /// <summary>
        /// Gets all active (non-deleted) categories.
        /// </summary>
        /// <param name="trackChanges">Whether to track changes for updates</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>List of active categories ordered by display order</returns>
        Task<IReadOnlyList<Category>> GetAllActiveAsync(bool trackChanges, CancellationToken cancellationToken);

        /// <summary>
        /// Checks if a category with the given name exists.
        /// </summary>
        /// <param name="name">The category name to check</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>True if category exists; otherwise false</returns>
        Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken);

        /// <summary>
        /// Checks if a category with the given name exists, excluding a specific category ID.
        /// Useful for update operations to allow keeping the same name.
        /// </summary>
        /// <param name="name">The category name to check</param>
        /// <param name="excludeId">The category ID to exclude from the check</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>True if category exists; otherwise false</returns>
        Task<bool> ExistsByNameAsync(string name, Guid excludeId, CancellationToken cancellationToken);

        Task<(List<Category> categories, int totalCounts)> GetListAsync(int page, int pageSize, string search, bool isDeleted = false, CancellationToken cancellationToken = default);
    }
}

