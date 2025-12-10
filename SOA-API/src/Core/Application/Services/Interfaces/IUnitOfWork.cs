namespace Application.Services.Interfaces
{
    /// <summary>
    /// Interface Unit of Work pattern
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Begin a new transaction
        /// </summary>
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Commit transaction
        /// </summary>
        /// <returns>Number of lines</returns>
        Task<int> CommitAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Rollback transaction
        /// </summary>
        Task RollbackAsync(CancellationToken cancellationToken = default);
    }
}
