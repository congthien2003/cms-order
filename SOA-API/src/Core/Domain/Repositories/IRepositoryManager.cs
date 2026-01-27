namespace Domain.Repositories
{
    /// <summary>
    /// Interface for the repository manager (Unit of Work pattern).
    /// Provides access to all repository implementations and coordinates data persistence.
    /// </summary>
    public interface IRepositoryManager
    {
        /// <summary>
        /// Gets the user repository instance.
        /// </summary>
        IUserRepository UserRepository { get; }

        /// <summary>
        /// Gets the role repository instance.
        /// </summary>
        IRoleRepository RoleRepository { get; }

        /// <summary>
        /// Gets the category repository instance.
        /// </summary>
        ICategoryRepository CategoryRepository { get; }

        /// <summary>
    /// Gets the product repository instance.
    /// </summary>
    IProductRepository ProductRepository { get; }

    /// <summary>
    /// Gets the topping repository instance.
    /// </summary>
    IToppingRepository ToppingRepository { get; }

    /// <summary>
    /// Gets the voucher repository instance.
    /// </summary>
    IVoucherRepository VoucherRepository { get; }

    /// <summary>
    /// Gets the order repository instance.
    /// </summary>
    IOrderRepository OrderRepository { get; }

    /// <summary>
    /// Gets the shop setting repository instance.
    /// </summary>
    IShopSettingRepository ShopSettingRepository { get; }

    /// <summary>
        /// </summary>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        Task SaveAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Saves changes to the database with optional audit disabling.
        /// </summary>
        /// <param name="isAudit">Whether to include audit information</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        Task SaveAsync(bool isAudit = false, CancellationToken cancellationToken = default);
    }
}

