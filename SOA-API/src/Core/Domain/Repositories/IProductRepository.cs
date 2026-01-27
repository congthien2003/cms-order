using Domain.Entities;

namespace Domain.Repositories
{
    /// <summary>
    /// Repository interface for Product entity
    /// </summary>
    public interface IProductRepository : IRepositoryBase<Product>
    {
        /// <summary>
        /// Lấy product kèm sizes và toppings
        /// </summary>
        Task<Product?> GetWithDetailsAsync(Guid id, bool trackChanges, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy products theo category
        /// </summary>
        Task<(IReadOnlyList<Product> products, int totalCount)> GetByCategoryAsync(
            Guid categoryId,
            int page,
            int pageSize,
            string? searchTerm,
            bool trackChanges,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy danh sách products với phân trang
        /// </summary>
        Task<(IReadOnlyList<Product> products, int totalCount)> GetListAsync(
            int page,
            int pageSize,
            string? searchTerm,
            Guid? categoryId,
            bool? isActive,
            bool trackChanges,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Kiểm tra tên product có tồn tại không
        /// </summary>
        Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy products active để hiển thị cho mobile/POS
        /// </summary>
        Task<IReadOnlyList<Product>> GetActiveProductsAsync(Guid? categoryId = null, CancellationToken cancellationToken = default);
    }
}
