namespace Domain.Entities.Enums
{
    /// <summary>
    /// Loại giảm giá của voucher
    /// </summary>
    public enum DiscountType
    {
        /// <summary>
        /// Giảm theo phần trăm (%)
        /// </summary>
        Percentage = 1,

        /// <summary>
        /// Giảm số tiền cố định
        /// </summary>
        FixedAmount = 2
    }
}
