using Domain.Abstractions;
using Domain.Entities.Enums;

namespace Domain.Entities
{
    /// <summary>
    /// Entity Voucher - Đại diện cho mã giảm giá/khuyến mãi
    /// </summary>
    public class Voucher : BaseEntity
    {
        /// <summary>
        /// Mã voucher (unique)
        /// </summary>
        public string Code { get; private set; }

        /// <summary>
        /// Tên voucher
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Mô tả voucher
        /// </summary>
        public string? Description { get; private set; }

        /// <summary>
        /// Loại giảm giá (Percentage hoặc FixedAmount)
        /// </summary>
        public DiscountType DiscountType { get; private set; }

        /// <summary>
        /// Giá trị giảm (% hoặc số tiền)
        /// </summary>
        public decimal DiscountValue { get; private set; }

        /// <summary>
        /// Số tiền đơn hàng tối thiểu để áp dụng voucher
        /// </summary>
        public decimal? MinOrderAmount { get; private set; }

        /// <summary>
        /// Số tiền giảm tối đa (áp dụng cho DiscountType = Percentage)
        /// </summary>
        public decimal? MaxDiscountAmount { get; private set; }

        /// <summary>
        /// Ngày bắt đầu hiệu lực
        /// </summary>
        public DateTime StartDate { get; private set; }

        /// <summary>
        /// Ngày hết hiệu lực
        /// </summary>
        public DateTime EndDate { get; private set; }

        /// <summary>
        /// Số lần sử dụng tối đa (null = không giới hạn)
        /// </summary>
        public int? UsageLimit { get; private set; }

        /// <summary>
        /// Số lần đã sử dụng
        /// </summary>
        public int UsedCount { get; private set; } = 0;

        /// <summary>
        /// Trạng thái kích hoạt
        /// </summary>
        public bool IsActive { get; private set; } = true;

        // Navigation property
        public virtual ICollection<Order> Orders { get; private set; } = new List<Order>();

        // Constructor for EF Core
        private Voucher() { }

        /// <summary>
        /// Constructor tạo Voucher mới
        /// </summary>
        public Voucher(
            string code,
            string name,
            DiscountType discountType,
            decimal discountValue,
            DateTime startDate,
            DateTime endDate,
            string? description = null,
            decimal? minOrderAmount = null,
            decimal? maxDiscountAmount = null,
            int? usageLimit = null)
        {
            if (string.IsNullOrWhiteSpace(code))
                throw new ArgumentException("Voucher code is required", nameof(code));

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Voucher name is required", nameof(name));

            if (discountValue <= 0)
                throw new ArgumentException("Discount value must be greater than 0", nameof(discountValue));

            if (discountType == DiscountType.Percentage && discountValue > 100)
                throw new ArgumentException("Percentage discount cannot exceed 100%", nameof(discountValue));

            if (startDate >= endDate)
                throw new ArgumentException("Start date must be before end date");

            Code = code.ToUpper();
            Name = name;
            Description = description;
            DiscountType = discountType;
            DiscountValue = discountValue;
            StartDate = startDate;
            EndDate = endDate;
            MinOrderAmount = minOrderAmount;
            MaxDiscountAmount = maxDiscountAmount;
            UsageLimit = usageLimit;
            UsedCount = 0;
            IsActive = true;
        }

        /// <summary>
        /// Cập nhật thông tin voucher
        /// </summary>
        public void UpdateDetails(
            string name,
            string? description,
            DiscountType discountType,
            decimal discountValue,
            DateTime startDate,
            DateTime endDate,
            decimal? minOrderAmount,
            decimal? maxDiscountAmount,
            int? usageLimit)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Voucher name is required", nameof(name));

            if (discountValue <= 0)
                throw new ArgumentException("Discount value must be greater than 0", nameof(discountValue));

            if (discountType == DiscountType.Percentage && discountValue > 100)
                throw new ArgumentException("Percentage discount cannot exceed 100%", nameof(discountValue));

            if (startDate >= endDate)
                throw new ArgumentException("Start date must be before end date");

            Name = name;
            Description = description;
            DiscountType = discountType;
            DiscountValue = discountValue;
            StartDate = startDate;
            EndDate = endDate;
            MinOrderAmount = minOrderAmount;
            MaxDiscountAmount = maxDiscountAmount;
            UsageLimit = usageLimit;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Kiểm tra voucher có hợp lệ không
        /// </summary>
        public bool IsValid(decimal orderAmount, out string? errorMessage)
        {
            errorMessage = null;

            if (!IsActive)
            {
                errorMessage = "Voucher is not active";
                return false;
            }

            var now = DateTime.UtcNow;
            if (now < StartDate || now > EndDate)
            {
                errorMessage = "Voucher is not valid at this time";
                return false;
            }

            if (UsageLimit.HasValue && UsedCount >= UsageLimit.Value)
            {
                errorMessage = "Voucher usage limit reached";
                return false;
            }

            if (MinOrderAmount.HasValue && orderAmount < MinOrderAmount.Value)
            {
                errorMessage = $"Order amount must be at least {MinOrderAmount.Value:C}";
                return false;
            }

            return true;
        }

        /// <summary>
        /// Tính số tiền giảm giá
        /// </summary>
        public decimal CalculateDiscount(decimal orderAmount)
        {
            if (!IsValid(orderAmount, out _))
                return 0;

            decimal discount = 0;

            if (DiscountType == DiscountType.Percentage)
            {
                discount = orderAmount * (DiscountValue / 100);
                
                if (MaxDiscountAmount.HasValue && discount > MaxDiscountAmount.Value)
                    discount = MaxDiscountAmount.Value;
            }
            else // FixedAmount
            {
                discount = DiscountValue;
            }

            // Discount không thể lớn hơn order amount
            return Math.Min(discount, orderAmount);
        }

        /// <summary>
        /// Tăng số lần sử dụng
        /// </summary>
        public void IncrementUsage()
        {
            UsedCount++;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Giảm số lần sử dụng (khi hủy đơn)
        /// </summary>
        public void DecrementUsage()
        {
            if (UsedCount > 0)
            {
                UsedCount--;
                UpdatedAt = DateTime.UtcNow;
            }
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
