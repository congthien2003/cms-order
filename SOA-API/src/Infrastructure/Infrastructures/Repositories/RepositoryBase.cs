using Domain.Abstractions;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructures.Repositories
{
    /// <summary>
    /// Base repository implementation with common CRUD operations
    /// </summary>
    public class RepositoryBase<T> : IRepositoryBase<T> where T : BaseEntity
    {
        protected readonly ApplicationDbContext _context;

        public RepositoryBase(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        // Async versions for backward compatibility
        public Task UpdateAsync(T entity)
        {
            Update(entity);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(T entity)
        {
            Delete(entity);
            return Task.CompletedTask;
        }

        public async Task<T?> GetByIdAsync(Guid id, bool trackChanges, CancellationToken cancellationToken = default)
        {
            IQueryable<T> query = _context.Set<T>();

            if (!trackChanges)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<T>> GetAllAsync(bool trackChanges, CancellationToken cancellationToken = default)
        {
            IQueryable<T> query = _context.Set<T>();

            if (!trackChanges)
            {
                query = query.AsNoTracking();
            }

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<T>> FindByConditionAsync(
            Expression<Func<T, bool>> expression,
            bool trackChanges,
            CancellationToken cancellationToken = default)
        {
            IQueryable<T> query = _context.Set<T>().Where(expression);

            if (!trackChanges)
            {
                query = query.AsNoTracking();
            }

            return await query.ToListAsync(cancellationToken);
        }
    }
}
