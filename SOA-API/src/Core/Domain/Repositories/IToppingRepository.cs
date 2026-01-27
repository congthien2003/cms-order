using Domain.Entities;

namespace Domain.Repositories
{
    /// <summary>
    /// Repository interface for Topping entity
    /// </summary>
    public interface IToppingRepository : IRepositoryBase<Topping>
    {
        /// <summary>
        /// Lấy danh sách toppings với phân trang
        /// </summary>
        Task<(IReadOnlyList<Topping> toppings, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            bool? isActive,
            bool trackChanges,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy toppings của một product
        /// </summary>
        Task<IReadOnlyList<Topping>> GetByProductIdAsync(
            Guid productId,
            bool trackChanges,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy toppings active để hiển thị cho mobile/POS
        /// </summary>
        Task<IReadOnlyList<Topping>> GetActiveToppingsAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Kiểm tra tên topping có tồn tại không
        /// </summary>
        Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default);
    }
}
