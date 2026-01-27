using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity ProductSize - Quản lý các size của sản phẩm
    /// Ví dụ: S, M, L, XL với giá điều chỉnh khác nhau
    /// </summary>
    public class ProductSize : BaseEntity
    {
        /// <summary>
        /// ID sản phẩm
        /// </summary>
        public Guid ProductId { get; private set; }

        /// <summary>
        /// Tên size (S, M, L, XL, etc.)
        /// </summary>
        public string SizeName { get; private set; }

        /// <summary>
        /// Giá điều chỉnh so với BasePrice
        /// Ví dụ: BasePrice = 30k, Size M có PriceAdjustment = 5k => Giá M = 35k
        /// </summary>
        public decimal PriceAdjustment { get; private set; } = 0;

        /// <summary>
        /// Size mặc định của sản phẩm
        /// </summary>
        public bool IsDefault { get; private set; } = false;

        /// <summary>
        /// Trạng thái kích hoạt
        /// </summary>
        public bool IsActive { get; private set; } = true;

        // Navigation property
        public virtual Product Product { get; private set; } = null!;

        // Constructor for EF Core
        private ProductSize() { }

        /// <summary>
        /// Constructor tạo ProductSize mới
        /// </summary>
        public ProductSize(
            Guid productId,
            string sizeName,
            decimal priceAdjustment = 0,
            bool isDefault = false)
        {
            if (string.IsNullOrWhiteSpace(sizeName))
                throw new ArgumentException("Size name is required", nameof(sizeName));

            ProductId = productId;
            SizeName = sizeName;
            PriceAdjustment = priceAdjustment;
            IsDefault = isDefault;
            IsActive = true;
        }

        /// <summary>
        /// Cập nhật thông tin size
        /// </summary>
        public void UpdateDetails(string sizeName, decimal priceAdjustment, bool isDefault)
        {
            if (string.IsNullOrWhiteSpace(sizeName))
                throw new ArgumentException("Size name is required", nameof(sizeName));

            SizeName = sizeName;
            PriceAdjustment = priceAdjustment;
            IsDefault = isDefault;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Đặt làm size mặc định
        /// </summary>
        public void SetAsDefault()
        {
            IsDefault = true;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Bỏ size mặc định
        /// </summary>
        public void UnsetDefault()
        {
            IsDefault = false;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Bật/tắt trạng thái
        /// </summary>
        public void ToggleStatus()
        {
            IsActive = !IsActive;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
