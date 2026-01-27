using Domain.Entities;
using Domain.Entities.Enums;

namespace Domain.Repositories
{
    /// <summary>
    /// Repository interface for Order entity
    /// </summary>
    public interface IOrderRepository : IRepositoryBase<Order>
    {
        /// <summary>
        /// Lấy order kèm items và toppings
        /// </summary>
        Task<Order?> GetWithDetailsAsync(Guid id, bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy order theo order number
        /// </summary>
        Task<Order?> GetByOrderNumberAsync(string orderNumber, bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy danh sách orders với phân trang và filter
        /// </summary>
        Task<(IReadOnlyList<Order> orders, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            OrderStatus? status,
            PaymentStatus? paymentStatus,
            DateTime? fromDate,
            DateTime? toDate,
            bool trackChanges,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy orders trong ngày
        /// </summary>
        Task<IReadOnlyList<Order>> GetTodayOrdersAsync(bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy orders đang trong queue (Pending, Confirmed, Preparing)
        /// </summary>
        Task<IReadOnlyList<Order>> GetQueueOrdersAsync(bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Generate order number mới
        /// Format: ORD-20260127-001
        /// </summary>
        Task<string> GenerateOrderNumberAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Kiểm tra order number đã tồn tại chưa
        /// </summary>
        Task<bool> ExistsByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy tổng doanh thu theo khoảng thời gian
        /// </summary>
        Task<decimal> GetTotalRevenueAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

        /// <summary>
        /// Đếm số đơn theo trạng thái
        /// </summary>
        Task<Dictionary<OrderStatus, int>> GetOrderCountByStatusAsync(DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);
    }
}
