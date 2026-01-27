using Domain.Abstractions;
using System.Linq.Expressions;

namespace Domain.Repositories
{
    /// <summary>
    /// Base repository interface for common CRUD operations
    /// </summary>
    public interface IRepositoryBase<T> where T : BaseEntity
    {
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<T?> GetByIdAsync(Guid id, bool trackChanges, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetAllAsync(bool trackChanges, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> FindByConditionAsync(
            Expression<Func<T, bool>> expression,
            bool trackChanges,
            CancellationToken cancellationToken = default);
    }
}
