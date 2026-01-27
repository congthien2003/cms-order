using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class VoucherRepository : RepositoryBase<Voucher>, IVoucherRepository
    {
        public VoucherRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<(IReadOnlyList<Voucher> vouchers, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            bool? isActive,
            bool? isExpired,
            bool trackChanges,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Voucher>().AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(v => v.Code.Contains(searchTerm) || v.Name.Contains(searchTerm));

            if (isActive.HasValue)
                query = query.Where(v => v.IsActive == isActive.Value);

            if (isExpired.HasValue)
            {
                var now = DateTime.UtcNow;
                if (isExpired.Value)
                    query = query.Where(v => v.EndDate < now);
                else
                    query = query.Where(v => v.EndDate >= now);
            }

            if (!trackChanges)
                query = query.AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var vouchers = await query
                .OrderByDescending(v => v.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (vouchers, totalCount);
        }

        public async Task<Voucher?> GetByCodeAsync(string code, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Voucher>().AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(v => v.Code == code, cancellationToken);
        }

        public async Task<bool> ExistsByCodeAsync(string code, Guid? excludeId, CancellationToken cancellationToken)
        {
            var query = _context.Set<Voucher>().Where(v => v.Code == code);

            if (excludeId.HasValue)
                query = query.Where(v => v.Id != excludeId.Value);

            return await query.AnyAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Voucher>> GetActiveVouchersAsync(CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;
            
            var query = _context.Set<Voucher>()
                .Where(v => v.IsActive && v.StartDate <= now && v.EndDate >= now)
                .AsNoTracking();

            return await query
                .OrderBy(v => v.Name)
                .ToListAsync(cancellationToken);
        }
    }
}
