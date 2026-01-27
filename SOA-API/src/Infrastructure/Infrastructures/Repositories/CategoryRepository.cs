using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Category?> GetByNameAsync(string name, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Category>().AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(
                c => c.Name == name,
                cancellationToken);
        }

        public async Task<IReadOnlyList<Category>> GetAllActiveAsync(bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Category>().AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken)
        {
            return await _context.Set<Category>()
                .AnyAsync(c => c.Name == name, cancellationToken);
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid excludeId, CancellationToken cancellationToken)
        {
            return await _context.Set<Category>()
                .AnyAsync(c => c.Name == name && c.Id != excludeId, cancellationToken);
        }

        public async Task<(List<Category> categories, int totalCounts)> GetListAsync(int page, int pageSize, string search, bool isDeleted = false, CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Category>().AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(c => c.Name.Contains(search) || c.Description.Contains(search));

            if (!isDeleted)
                query = query.Where(c => !c.IsDeleted);
            else
                query = query.Where(c => c.IsDeleted);

            var totalCount = await query.CountAsync(cancellationToken);

            var categories = await query
                .OrderBy(c => c.DisplayOrder)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (categories, totalCount);
        }
    }
}
