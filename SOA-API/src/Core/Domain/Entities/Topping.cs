using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity Topping - Đại diện cho các topping có thể thêm vào sản phẩm
    /// Ví dụ: Trân châu, thạch, pudding, kem cheese, etc.
    /// </summary>
    public class Topping : BaseEntity
    {
        /// <summary>
        /// Tên topping
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Giá topping
        /// </summary>
        public decimal Price { get; private set; }

        /// <summary>
        /// URL hình ảnh topping
        /// </summary>
        public string? ImageUrl { get; private set; }

        /// <summary>
        /// Trạng thái kích hoạt
        /// </summary>
        public bool IsActive { get; private set; } = true;

        /// <summary>
        /// Thứ tự hiển thị
        /// </summary>
        public int SortOrder { get; private set; } = 0;

        // Navigation property
        /// <summary>
        /// Danh sách mapping với các sản phẩm
        /// </summary>
        public virtual ICollection<ProductTopping> ProductToppings { get; private set; } = new List<ProductTopping>();

        // Constructor for EF Core
        private Topping() { }

        /// <summary>
        /// Constructor tạo Topping mới
        /// </summary>
        public Topping(
            string name,
            decimal price,
            string? imageUrl = null,
            int sortOrder = 0)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Topping name is required", nameof(name));

            if (price < 0)
                throw new ArgumentException("Price must be non-negative", nameof(price));

            Name = name;
            Price = price;
            ImageUrl = imageUrl;
            SortOrder = sortOrder;
            IsActive = true;
        }

        /// <summary>
        /// Cập nhật thông tin topping
        /// </summary>
        public void UpdateDetails(
            string name,
            decimal price,
            string? imageUrl = null,
            int sortOrder = 0)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Topping name is required", nameof(name));

            if (price < 0)
                throw new ArgumentException("Price must be non-negative", nameof(price));

            Name = name;
            Price = price;
            ImageUrl = imageUrl;
            SortOrder = sortOrder;
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

        /// <summary>
        /// Cập nhật giá
        /// </summary>
        public void UpdatePrice(decimal price)
        {
            if (price < 0)
                throw new ArgumentException("Price must be non-negative", nameof(price));

            Price = price;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật hình ảnh
        /// </summary>
        public void UpdateImage(string? imageUrl)
        {
            ImageUrl = imageUrl;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
