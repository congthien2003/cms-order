using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructures.Repositories.Implementations
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DbContext _applicationDbContext;

        public Repository(DbContext applicationDbContext) => _applicationDbContext = applicationDbContext;

        // CRUD cơ bản
        public async Task AddAsync(T entity) => await _applicationDbContext.Set<T>().AddAsync(entity);

        public Task UpdateAsync(T entity)
        {
            _applicationDbContext.Set<T>().Update(entity);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(T entity)
        {
            _applicationDbContext.Set<T>().Remove(entity);
            return Task.CompletedTask;
        }

        public async Task<T?> GetByIdAsync(Guid id, bool trackChanges, CancellationToken cancellationToken)
        {
            return await _applicationDbContext.Set<T>().FindAsync(id);
        }

        public Task<IEnumerable<T>> GetAllAsync(bool trackChanges, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }



        public Task<IEnumerable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        // List + Count với Specification
        //public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        //{
        //    var query = SpecificationEvaluator<T>.GetQuery(_applicationDbContext.Set<T>().AsQueryable(), spec);
        //    return await query.ToListAsync();
        //}

        //public async Task<int> CountAsync(ISpecification<T> spec)
        //{
        //    var query = SpecificationEvaluator<T>.GetQuery(_applicationDbContext.Set<T>().AsQueryable(), spec);
        //    return await query.CountAsync();
        //}
    }
}
