using Domain.Entities;
using Domain.Entities.Enums;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class OrderRepository : RepositoryBase<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Order?> GetWithDetailsAsync(Guid id, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Order>()
                .Include(o => o.Items)
                    .ThenInclude(i => i.Toppings)
                .Include(o => o.Voucher)
                .AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        public async Task<Order?> GetByOrderNumberAsync(string orderNumber, bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Order>().AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber, cancellationToken);
        }

        public async Task<(IReadOnlyList<Order> orders, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            OrderStatus? status,
            PaymentStatus? paymentStatus,
            DateTime? fromDate,
            DateTime? toDate,
            bool trackChanges,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Order>().AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(o => o.OrderNumber.Contains(searchTerm) || o.CustomerName.Contains(searchTerm));

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            if (paymentStatus.HasValue)
                query = query.Where(o => o.PaymentStatus == paymentStatus.Value);

            if (fromDate.HasValue)
                query = query.Where(o => o.CreatedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(o => o.CreatedAt <= toDate.Value);

            if (!trackChanges)
                query = query.AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (orders, totalCount);
        }

        public async Task<IReadOnlyList<Order>> GetTodayOrdersAsync(bool trackChanges, CancellationToken cancellationToken)
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var query = _context.Set<Order>()
                .Where(o => o.CreatedAt >= today && o.CreatedAt < tomorrow)
                .AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Order>> GetQueueOrdersAsync(bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<Order>()
                .Where(o => o.Status == OrderStatus.Confirmed || o.Status == OrderStatus.Preparing || o.Status == OrderStatus.Ready)
                .AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query
                .OrderBy(o => o.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<string> GenerateOrderNumberAsync(CancellationToken cancellationToken)
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var todayOrderCount = await _context.Set<Order>()
                .Where(o => o.CreatedAt >= today && o.CreatedAt < tomorrow)
                .CountAsync(cancellationToken);

            var orderNumber = $"ORD{today:yyyyMMdd}{(todayOrderCount + 1):D4}";
            return orderNumber;
        }

        public async Task<bool> ExistsByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken)
        {
            return await _context.Set<Order>()
                .AnyAsync(o => o.OrderNumber == orderNumber, cancellationToken);
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Order>()
                .Where(o => o.Status == OrderStatus.Completed && o.PaymentStatus == PaymentStatus.Paid)
                .Where(o => o.CreatedAt >= fromDate && o.CreatedAt <= toDate);

            return await query.SumAsync(o => o.TotalAmount, cancellationToken);
        }

        public async Task<Dictionary<OrderStatus, int>> GetOrderCountByStatusAsync(DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Set<Order>().AsQueryable();

            if (fromDate.HasValue)
                query = query.Where(o => o.CreatedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(o => o.CreatedAt <= toDate.Value);

            var result = await query
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync(cancellationToken);

            return result.ToDictionary(x => x.Status, x => x.Count);
        }
    }
}
