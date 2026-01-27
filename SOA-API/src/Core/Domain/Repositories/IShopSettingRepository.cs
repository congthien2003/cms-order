using Domain.Entities;

namespace Domain.Repositories
{
    /// <summary>
    /// Repository interface for ShopSetting entity
    /// </summary>
    public interface IShopSettingRepository : IRepositoryBase<ShopSetting>
    {
        /// <summary>
        /// Lấy cài đặt cửa hàng (chỉ có 1 record)
        /// </summary>
        Task<ShopSetting?> GetSettingsAsync(bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Kiểm tra đã có settings chưa
        /// </summary>
        Task<bool> ExistsAsync(CancellationToken cancellationToken = default);
    }
}
