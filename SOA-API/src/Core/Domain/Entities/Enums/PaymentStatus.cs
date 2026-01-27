namespace Domain.Entities.Enums
{
    /// <summary>
    /// Trạng thái thanh toán
    /// </summary>
    public enum PaymentStatus
    {
        /// <summary>
        /// Chưa thanh toán
        /// </summary>
        Pending = 1,

        /// <summary>
        /// Đã thanh toán
        /// </summary>
        Paid = 2,

        /// <summary>
        /// Đã hoàn tiền
        /// </summary>
        Refunded = 3
    }
}
