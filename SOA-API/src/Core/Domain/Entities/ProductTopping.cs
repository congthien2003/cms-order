using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity ProductTopping - Mapping giữa Product và Topping
    /// Xác định topping nào có thể dùng cho sản phẩm nào
    /// </summary>
    public class ProductTopping : BaseEntity
    {
        /// <summary>
        /// ID sản phẩm
        /// </summary>
        public Guid ProductId { get; private set; }

        /// <summary>
        /// ID topping
        /// </summary>
        public Guid ToppingId { get; private set; }

        /// <summary>
        /// Topping mặc định cho sản phẩm này
        /// </summary>
        public bool IsDefault { get; private set; } = false;

        // Navigation properties
        public virtual Product Product { get; private set; } = null!;
        public virtual Topping Topping { get; private set; } = null!;

        // Constructor for EF Core
        private ProductTopping() { }

        /// <summary>
        /// Constructor tạo ProductTopping mới
        /// </summary>
        public ProductTopping(Guid productId, Guid toppingId, bool isDefault = false)
        {
            ProductId = productId;
            ToppingId = toppingId;
            IsDefault = isDefault;
        }

        /// <summary>
        /// Đặt làm topping mặc định
        /// </summary>
        public void SetAsDefault()
        {
            IsDefault = true;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Bỏ topping mặc định
        /// </summary>
        public void UnsetDefault()
        {
            IsDefault = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
