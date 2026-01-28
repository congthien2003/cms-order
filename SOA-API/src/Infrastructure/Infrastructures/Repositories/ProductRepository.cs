using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class ProductRepository : RepositoryBase<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Product?> GetWithDetailsAsync(Guid id, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Product>()
                .Include(p => p.Category)
                .Include(p => p.Sizes)
                .Include(p => p.ProductToppings)
                    .ThenInclude(pt => pt.Topping)
                .AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }

        public async Task<(IReadOnlyList<Product> products, int totalCount)> GetByCategoryAsync(
            Guid categoryId,
            int page,
            int pageSize,
            string? searchTerm,
            bool trackChanges,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Product>()
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm));

            if (!trackChanges)
                query = query.AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var products = await query
                .OrderBy(p => p.SortOrder)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (products, totalCount);
        }

        public async Task<(IReadOnlyList<Product> products, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            Guid? categoryId,
            bool? isActive,
            bool trackChanges,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Product>()
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm));

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            if (isActive.HasValue)
                query = query.Where(p => p.IsActive == isActive.Value);

            if (!trackChanges)
                query = query.AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var products = await query
                .OrderBy(p => p.SortOrder)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (products, totalCount);
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid? excludeId, CancellationToken cancellationToken)
        {
            var query = _context.Set<Product>().Where(p => p.Name == name);

            if (excludeId.HasValue)
                query = query.Where(p => p.Id != excludeId.Value);

            return await query.AnyAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Product>> GetActiveProductsAsync(Guid? categoryId = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Product>()
                .Where(p => p.IsActive)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            return await query
                .AsNoTracking()
                .OrderBy(p => p.SortOrder)
                .ToListAsync(cancellationToken);
        }
    }
}
