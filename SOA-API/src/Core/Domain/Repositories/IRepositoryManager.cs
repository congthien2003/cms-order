namespace Domain.Repositories
{
    /// <summary>
    /// Interface for the repository manager (Unit of Work pattern).
    /// Provides access to all repository implementations and coordinates data persistence.
    /// </summary>
    public interface IRepositoryManager
    {
        /// <summary>
        /// Gets the user repository instance.
        /// </summary>
        IUserRepository UserRepository { get; }

        /// <summary>
        /// Gets the role repository instance.
        /// </summary>
        IRoleRepository RoleRepository { get; }

        /// <summary>
        /// Gets the category repository instance.
        /// </summary>
        ICategoryRepository CategoryRepository { get; }

        /// <summary>
        /// Disposes the repository manager and releases resources.
        /// </summary>
        Task DisposeAsync();

        /// <summary>
        /// Saves all changes made in the repositories to the database.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        Task SaveAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Saves changes to the database with optional audit disabling.
        /// </summary>
        /// <param name="isAudit">Whether to include audit information</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        Task SaveAsync(bool isAudit = false, CancellationToken cancellationToken = default);
    }
}

