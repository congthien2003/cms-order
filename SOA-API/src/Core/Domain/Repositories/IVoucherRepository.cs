using Domain.Entities;
using Domain.Entities.Enums;

namespace Domain.Repositories
{
    /// <summary>
    /// Repository interface for Voucher entity
    /// </summary>
    public interface IVoucherRepository : IRepositoryBase<Voucher>
    {
        /// <summary>
        /// Lấy danh sách vouchers với phân trang
        /// </summary>
        Task<(IReadOnlyList<Voucher> vouchers, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            bool? isActive,
            bool? isExpired,
            bool trackChanges,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy voucher theo code
        /// </summary>
        Task<Voucher?> GetByCodeAsync(string code, bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Kiểm tra code có tồn tại không
        /// </summary>
        Task<bool> ExistsByCodeAsync(string code, Guid? excludeId = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy vouchers đang active và còn hiệu lực
        /// </summary>
        Task<IReadOnlyList<Voucher>> GetActiveVouchersAsync(CancellationToken cancellationToken = default);
    }
}
