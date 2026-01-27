using Domain.Abstractions;
using Domain.Entities.Enums;

namespace Domain.Entities
{
    /// <summary>
    /// Entity Order - Đại diện cho đơn hàng
    /// </summary>
    public class Order : BaseEntity
    {
        /// <summary>
        /// Mã đơn hàng (auto-generate, unique)
        /// Format: ORD-20260127-001
        /// </summary>
        public string OrderNumber { get; private set; }

        /// <summary>
        /// Tên khách hàng (nullable cho đơn tại quầy)
        /// </summary>
        public string? CustomerName { get; private set; }

        /// <summary>
        /// Số điện thoại khách hàng
        /// </summary>
        public string? CustomerPhone { get; private set; }

        /// <summary>
        /// Tổng tiền trước giảm giá
        /// </summary>
        public decimal SubTotal { get; private set; }

        /// <summary>
        /// Số tiền được giảm
        /// </summary>
        public decimal DiscountAmount { get; private set; } = 0;

        /// <summary>
        /// Tiền VAT
        /// </summary>
        public decimal VATAmount { get; private set; } = 0;

        /// <summary>
        /// Phần trăm VAT
        /// </summary>
        public decimal VATPercentage { get; private set; } = 0;

        /// <summary>
        /// Có tính VAT không
        /// </summary>
        public bool IsVATIncluded { get; private set; } = false;

        /// <summary>
        /// Tổng tiền cuối cùng (SubTotal - DiscountAmount + VATAmount)
        /// </summary>
        public decimal TotalAmount { get; private set; }

        /// <summary>
        /// ID voucher (nếu có)
        /// </summary>
        public Guid? VoucherId { get; private set; }

        /// <summary>
        /// Mã voucher lưu lại tại thời điểm đặt
        /// </summary>
        public string? VoucherCode { get; private set; }

        /// <summary>
        /// Trạng thái đơn hàng
        /// </summary>
        public OrderStatus Status { get; private set; }

        /// <summary>
        /// Phương thức thanh toán
        /// </summary>
        public PaymentMethod PaymentMethod { get; private set; }

        /// <summary>
        /// Trạng thái thanh toán
        /// </summary>
        public PaymentStatus PaymentStatus { get; private set; }

        /// <summary>
        /// Ghi chú đơn hàng
        /// </summary>
        public string? Note { get; private set; }

        // Navigation properties
        public virtual Voucher? Voucher { get; private set; }
        public virtual ICollection<OrderItem> Items { get; private set; } = new List<OrderItem>();

        // Constructor for EF Core
        private Order() { }

        /// <summary>
        /// Constructor tạo Order mới
        /// </summary>
        public Order(
            string orderNumber,
            PaymentMethod paymentMethod,
            string? customerName = null,
            string? customerPhone = null,
            string? note = null)
        {
            if (string.IsNullOrWhiteSpace(orderNumber))
                throw new ArgumentException("Order number is required", nameof(orderNumber));

            OrderNumber = orderNumber;
            CustomerName = customerName;
            CustomerPhone = customerPhone;
            Note = note;
            PaymentMethod = paymentMethod;
            Status = OrderStatus.Pending;
            PaymentStatus = PaymentStatus.Pending;
            SubTotal = 0;
            DiscountAmount = 0;
            VATAmount = 0;
            TotalAmount = 0;
        }

        /// <summary>
        /// Tính toán lại tổng tiền đơn hàng
        /// </summary>
        public void RecalculateTotals(
            decimal subTotal,
            decimal? discountAmount = null,
            decimal? vatPercentage = null)
        {
            SubTotal = subTotal;
            DiscountAmount = discountAmount ?? 0;
            VATPercentage = vatPercentage ?? 0;

            var amountAfterDiscount = SubTotal - DiscountAmount;

            if (VATPercentage > 0)
            {
                IsVATIncluded = true;
                VATAmount = amountAfterDiscount * (VATPercentage / 100);
            }
            else
            {
                IsVATIncluded = false;
                VATAmount = 0;
            }

            TotalAmount = amountAfterDiscount + VATAmount;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Áp dụng voucher
        /// </summary>
        public void ApplyVoucher(Guid voucherId, string voucherCode, decimal discountAmount)
        {
            VoucherId = voucherId;
            VoucherCode = voucherCode;
            DiscountAmount = discountAmount;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Xóa voucher
        /// </summary>
        public void RemoveVoucher()
        {
            VoucherId = null;
            VoucherCode = null;
            DiscountAmount = 0;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật trạng thái đơn hàng
        /// </summary>
        public void UpdateStatus(OrderStatus newStatus)
        {
            // Business rules cho status transition
            if (Status == OrderStatus.Cancelled)
                throw new InvalidOperationException("Cannot update cancelled order");

            if (Status == OrderStatus.Completed)
                throw new InvalidOperationException("Cannot update completed order");

            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Xác nhận đơn hàng
        /// </summary>
        public void Confirm()
        {
            if (Status != OrderStatus.Pending)
                throw new InvalidOperationException("Only pending orders can be confirmed");

            Status = OrderStatus.Confirmed;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Bắt đầu chuẩn bị đơn
        /// </summary>
        public void StartPreparing()
        {
            if (Status != OrderStatus.Confirmed)
                throw new InvalidOperationException("Order must be confirmed before preparing");

            Status = OrderStatus.Preparing;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Đánh dấu đơn đã sẵn sàng
        /// </summary>
        public void MarkAsReady()
        {
            if (Status != OrderStatus.Preparing)
                throw new InvalidOperationException("Order must be preparing before marking as ready");

            Status = OrderStatus.Ready;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Hoàn thành đơn hàng
        /// </summary>
        public void Complete()
        {
            if (Status != OrderStatus.Ready)
                throw new InvalidOperationException("Order must be ready before completing");

            Status = OrderStatus.Completed;
            PaymentStatus = PaymentStatus.Paid;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Hủy đơn hàng
        /// </summary>
        public void Cancel(string? reason = null)
        {
            if (Status == OrderStatus.Completed)
                throw new InvalidOperationException("Cannot cancel completed order");

            Status = OrderStatus.Cancelled;
            if (!string.IsNullOrEmpty(reason))
                Note = Note != null ? $"{Note}. Cancelled: {reason}" : $"Cancelled: {reason}";
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật trạng thái thanh toán
        /// </summary>
        public void UpdatePaymentStatus(PaymentStatus newStatus)
        {
            PaymentStatus = newStatus;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Đánh dấu đã thanh toán
        /// </summary>
        public void MarkAsPaid()
        {
            PaymentStatus = PaymentStatus.Paid;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Hoàn tiền
        /// </summary>
        public void Refund()
        {
            if (PaymentStatus != PaymentStatus.Paid)
                throw new InvalidOperationException("Can only refund paid orders");

            PaymentStatus = PaymentStatus.Refunded;
            Status = OrderStatus.Cancelled;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật thông tin khách hàng
        /// </summary>
        public void UpdateCustomerInfo(string? customerName, string? customerPhone)
        {
            CustomerName = customerName;
            CustomerPhone = customerPhone;
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
