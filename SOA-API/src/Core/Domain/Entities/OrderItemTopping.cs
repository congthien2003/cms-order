using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity OrderItemTopping - Topping trong chi tiết đơn hàng
    /// Lưu lại thông tin topping tại thời điểm đặt hàng
    /// </summary>
    public class OrderItemTopping : BaseEntity
    {
        /// <summary>
        /// ID OrderItem
        /// </summary>
        public Guid OrderItemId { get; private set; }

        /// <summary>
        /// ID Topping
        /// </summary>
        public Guid ToppingId { get; private set; }

        /// <summary>
        /// Tên topping lưu lại tại thời điểm đặt
        /// </summary>
        public string ToppingName { get; private set; }

        /// <summary>
        /// Giá topping lưu lại tại thời điểm đặt
        /// </summary>
        public decimal Price { get; private set; }

        /// <summary>
        /// Số lượng (thường là 1, nhưng có thể nhiều hơn)
        /// </summary>
        public int Quantity { get; private set; } = 1;

        // Navigation properties
        public virtual OrderItem OrderItem { get; private set; } = null!;
        public virtual Topping Topping { get; private set; } = null!;

        // Constructor for EF Core
        private OrderItemTopping() { }

        /// <summary>
        /// Constructor tạo OrderItemTopping mới
        /// </summary>
        public OrderItemTopping(
            Guid orderItemId,
            Guid toppingId,
            string toppingName,
            decimal price,
            int quantity = 1)
        {
            if (string.IsNullOrWhiteSpace(toppingName))
                throw new ArgumentException("Topping name is required", nameof(toppingName));

            if (price < 0)
                throw new ArgumentException("Price must be non-negative", nameof(price));

            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than 0", nameof(quantity));

            OrderItemId = orderItemId;
            ToppingId = toppingId;
            ToppingName = toppingName;
            Price = price;
            Quantity = quantity;
        }

        /// <summary>
        /// Tính tổng tiền topping này
        /// </summary>
        public decimal CalculateTotal()
        {
            return Price * Quantity;
        }

        /// <summary>
        /// Cập nhật số lượng
        /// </summary>
        public void UpdateQuantity(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than 0", nameof(quantity));

            Quantity = quantity;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
