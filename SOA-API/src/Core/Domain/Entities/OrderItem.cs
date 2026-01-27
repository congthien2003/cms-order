using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity OrderItem - Chi tiết đơn hàng (từng sản phẩm trong đơn)
    /// </summary>
    public class OrderItem : BaseEntity
    {
        /// <summary>
        /// ID đơn hàng
        /// </summary>
        public Guid OrderId { get; private set; }

        /// <summary>
        /// ID sản phẩm
        /// </summary>
        public Guid ProductId { get; private set; }

        /// <summary>
        /// Tên sản phẩm lưu lại tại thời điểm đặt
        /// </summary>
        public string ProductName { get; private set; }

        /// <summary>
        /// ID size sản phẩm (nullable)
        /// </summary>
        public Guid? ProductSizeId { get; private set; }

        /// <summary>
        /// Tên size lưu lại tại thời điểm đặt
        /// </summary>
        public string? SizeName { get; private set; }

        /// <summary>
        /// Số lượng
        /// </summary>
        public int Quantity { get; private set; }

        /// <summary>
        /// Giá đơn vị (đã bao gồm size adjustment)
        /// </summary>
        public decimal UnitPrice { get; private set; }

        /// <summary>
        /// Tổng tiền topping
        /// </summary>
        public decimal ToppingTotal { get; private set; } = 0;

        /// <summary>
        /// Tổng tiền item (UnitPrice * Quantity + ToppingTotal)
        /// </summary>
        public decimal ItemTotal { get; private set; }

        /// <summary>
        /// Ghi chú cho item
        /// </summary>
        public string? Note { get; private set; }

        // Navigation properties
        public virtual Order Order { get; private set; } = null!;
        public virtual Product Product { get; private set; } = null!;
        public virtual ProductSize? ProductSize { get; private set; }
        public virtual ICollection<OrderItemTopping> Toppings { get; private set; } = new List<OrderItemTopping>();

        // Constructor for EF Core
        private OrderItem() { }

        /// <summary>
        /// Constructor tạo OrderItem mới
        /// </summary>
        public OrderItem(
            Guid orderId,
            Guid productId,
            string productName,
            int quantity,
            decimal unitPrice,
            Guid? productSizeId = null,
            string? sizeName = null,
            string? note = null)
        {
            if (string.IsNullOrWhiteSpace(productName))
                throw new ArgumentException("Product name is required", nameof(productName));

            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than 0", nameof(quantity));

            if (unitPrice < 0)
                throw new ArgumentException("Unit price must be non-negative", nameof(unitPrice));

            OrderId = orderId;
            ProductId = productId;
            ProductName = productName;
            ProductSizeId = productSizeId;
            SizeName = sizeName;
            Quantity = quantity;
            UnitPrice = unitPrice;
            Note = note;
            ToppingTotal = 0;
            ItemTotal = unitPrice * quantity;
        }

        /// <summary>
        /// Cập nhật tổng tiền topping
        /// </summary>
        public void UpdateToppingTotal(decimal toppingTotal)
        {
            ToppingTotal = toppingTotal;
            RecalculateTotal();
        }

        /// <summary>
        /// Cập nhật số lượng
        /// </summary>
        public void UpdateQuantity(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than 0", nameof(quantity));

            Quantity = quantity;
            RecalculateTotal();
        }

        /// <summary>
        /// Tính lại tổng tiền item
        /// </summary>
        private void RecalculateTotal()
        {
            ItemTotal = (UnitPrice * Quantity) + ToppingTotal;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật ghi chú
        /// </summary>
        public void UpdateNote(string? note)
        {
            Note = note;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
