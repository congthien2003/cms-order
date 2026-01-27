using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Entity ShopSetting - Cài đặt cửa hàng
    /// Chỉ có 1 record duy nhất trong bảng
    /// </summary>
    public class ShopSetting : BaseEntity
    {
        /// <summary>
        /// Tên cửa hàng
        /// </summary>
        public string ShopName { get; private set; }

        /// <summary>
        /// Địa chỉ
        /// </summary>
        public string Address { get; private set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        public string Phone { get; private set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; private set; }

        /// <summary>
        /// Logo URL
        /// </summary>
        public string? Logo { get; private set; }

        /// <summary>
        /// Phần trăm VAT mặc định
        /// </summary>
        public decimal DefaultVATPercentage { get; private set; } = 10;

        /// <summary>
        /// Có bật VAT không
        /// </summary>
        public bool IsVATEnabled { get; private set; } = true;

        /// <summary>
        /// Dòng chữ cuối hóa đơn
        /// </summary>
        public string? ReceiptFooter { get; private set; }

        // Constructor for EF Core
        private ShopSetting() { }

        /// <summary>
        /// Constructor tạo ShopSetting mới
        /// </summary>
        public ShopSetting(
            string shopName,
            string address,
            string phone,
            string email,
            decimal defaultVATPercentage = 10,
            bool isVATEnabled = true,
            string? logo = null,
            string? receiptFooter = null)
        {
            if (string.IsNullOrWhiteSpace(shopName))
                throw new ArgumentException("Shop name is required", nameof(shopName));

            if (string.IsNullOrWhiteSpace(address))
                throw new ArgumentException("Address is required", nameof(address));

            if (string.IsNullOrWhiteSpace(phone))
                throw new ArgumentException("Phone is required", nameof(phone));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email is required", nameof(email));

            if (defaultVATPercentage < 0 || defaultVATPercentage > 100)
                throw new ArgumentException("VAT percentage must be between 0 and 100", nameof(defaultVATPercentage));

            ShopName = shopName;
            Address = address;
            Phone = phone;
            Email = email;
            Logo = logo;
            DefaultVATPercentage = defaultVATPercentage;
            IsVATEnabled = isVATEnabled;
            ReceiptFooter = receiptFooter;
        }

        /// <summary>
        /// Cập nhật thông tin cửa hàng
        /// </summary>
        public void UpdateInfo(
            string shopName,
            string address,
            string phone,
            string email,
            string? logo = null,
            string? receiptFooter = null)
        {
            if (string.IsNullOrWhiteSpace(shopName))
                throw new ArgumentException("Shop name is required", nameof(shopName));

            if (string.IsNullOrWhiteSpace(address))
                throw new ArgumentException("Address is required", nameof(address));

            if (string.IsNullOrWhiteSpace(phone))
                throw new ArgumentException("Phone is required", nameof(phone));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email is required", nameof(email));

            ShopName = shopName;
            Address = address;
            Phone = phone;
            Email = email;
            Logo = logo;
            ReceiptFooter = receiptFooter;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật cài đặt VAT
        /// </summary>
        public void UpdateVATSettings(decimal vatPercentage, bool isEnabled)
        {
            if (vatPercentage < 0 || vatPercentage > 100)
                throw new ArgumentException("VAT percentage must be between 0 and 100", nameof(vatPercentage));

            DefaultVATPercentage = vatPercentage;
            IsVATEnabled = isEnabled;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật logo
        /// </summary>
        public void UpdateLogo(string? logo)
        {
            Logo = logo;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Cập nhật receipt footer
        /// </summary>
        public void UpdateReceiptFooter(string? receiptFooter)
        {
            ReceiptFooter = receiptFooter;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
