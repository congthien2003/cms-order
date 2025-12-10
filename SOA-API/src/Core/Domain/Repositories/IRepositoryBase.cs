using Domain.Abstractions;
using System.Linq.Expressions;

namespace Domain.Repositories
{
    public interface IRepository<T> where T : class
    {

        // CRUD cơ bản
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync(bool trackChanges, CancellationToken cancellationToken);
        Task<T?> GetByIdAsync(Guid id, bool trackChanges, CancellationToken cancellationToken);
        Task<IEnumerable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression,
            bool trackChanges, CancellationToken cancellationToken);

        //Task<(IEnumerable<T> Result, int TotalCount)> GetListWithCountAsync(GetListParameters parameters,
        //                                                                           bool trackChanges,
        //                                                                           CancellationToken cancellationToken);


        // Query theo Specification
        //Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        //Task<int> CountAsync(ISpecification<T> spec);
    }
}
