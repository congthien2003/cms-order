using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity sản phẩm (Product)
    /// Đại diện cho các sản phẩm bán tại cửa hàng
    /// </summary>
    public class Product : BaseEntity
    {
        /// <summary>
        /// ID danh mục sản phẩm
        /// </summary>
        public Guid CategoryId { get; private set; }

        /// <summary>
        /// Tên sản phẩm
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Mô tả sản phẩm
        /// </summary>
        public string? Description { get; private set; }

        /// <summary>
        /// URL hình ảnh sản phẩm
        /// </summary>
        public string? ImageUrl { get; private set; }

        /// <summary>
        /// Giá cơ bản của sản phẩm (size mặc định)
        /// </summary>
        public decimal BasePrice { get; private set; }

        /// <summary>
        /// Trạng thái kích hoạt
        /// </summary>
        public bool IsActive { get; private set; } = true;

        /// <summary>
        /// Thứ tự hiển thị
        /// </summary>
        public int SortOrder { get; private set; } = 0;

        // Navigation properties
        /// <summary>
        /// Danh mục của sản phẩm
        /// </summary>
        public virtual Category Category { get; private set; } = null!;

        /// <summary>
        /// Danh sách các size của sản phẩm
        /// </summary>
        public virtual ICollection<ProductSize> Sizes { get; private set; } = new List<ProductSize>();

        /// <summary>
        /// Danh sách các topping mapping
        /// </summary>
        public virtual ICollection<ProductTopping> ProductToppings { get; private set; } = new List<ProductTopping>();

        // Constructor for EF Core
        private Product() { }

        /// <summary>
        /// Constructor tạo sản phẩm mới
        /// </summary>
        public Product(
            Guid categoryId,
            string name,
            decimal basePrice,
            string? description = null,
            string? imageUrl = null,
            int sortOrder = 0)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Product name is required", nameof(name));

            if (basePrice < 0)
                throw new ArgumentException("Base price must be non-negative", nameof(basePrice));

            CategoryId = categoryId;
            Name = name;
            BasePrice = basePrice;
            Description = description;
            ImageUrl = imageUrl;
            SortOrder = sortOrder;
            IsActive = true;
        }

        /// <summary>
        /// Cập nhật thông tin sản phẩm
        /// </summary>
        public void UpdateDetails(
            string name,
            decimal basePrice,
            string? description = null,
            string? imageUrl = null,
            int sortOrder = 0)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Product name is required", nameof(name));

            if (basePrice < 0)
                throw new ArgumentException("Base price must be non-negative", nameof(basePrice));

            Name = name;
            BasePrice = basePrice;
            Description = description;
            ImageUrl = imageUrl;
            SortOrder = sortOrder;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Thay đổi danh mục sản phẩm
        /// </summary>
        public void ChangeCategory(Guid categoryId)
        {
            CategoryId = categoryId;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Bật/tắt trạng thái sản phẩm
        /// </summary>
        public void ToggleStatus()
        {
            IsActive = !IsActive;
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
