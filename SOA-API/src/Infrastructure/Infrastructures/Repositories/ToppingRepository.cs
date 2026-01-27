using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class ToppingRepository : RepositoryBase<Topping>, IToppingRepository
    {
        public ToppingRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<(IReadOnlyList<Topping> toppings, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            bool? isActive,
            bool trackChanges,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Topping>().AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(t => t.Name.Contains(searchTerm));

            if (isActive.HasValue)
                query = query.Where(t => t.IsActive == isActive.Value);

            if (!trackChanges)
                query = query.AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var toppings = await query
                .OrderBy(t => t.SortOrder)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (toppings, totalCount);
        }

        public async Task<IReadOnlyList<Topping>> GetByProductIdAsync(Guid productId, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<ProductTopping>()
                .Where(pt => pt.ProductId == productId)
                .Select(pt => pt.Topping)
                .AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query
                .OrderBy(t => t.SortOrder)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Topping>> GetActiveToppingsAsync(CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Topping>()
                .Where(t => t.IsActive)
                .AsNoTracking();

            return await query
                .OrderBy(t => t.SortOrder)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid? excludeId, CancellationToken cancellationToken)
        {
            var query = _context.Set<Topping>().Where(t => t.Name == name);

            if (excludeId.HasValue)
                query = query.Where(t => t.Id != excludeId.Value);

            return await query.AnyAsync(cancellationToken);
        }
    }
}
