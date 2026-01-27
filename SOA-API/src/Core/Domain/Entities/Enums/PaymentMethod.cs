namespace Domain.Entities.Enums
{
    /// <summary>
    /// Phương thức thanh toán
    /// </summary>
    public enum PaymentMethod
    {
        /// <summary>
        /// Tiền mặt
        /// </summary>
        Cash = 1,

        /// <summary>
        /// Chuyển khoản ngân hàng
        /// </summary>
        BankTransfer = 2,

        /// <summary>
        /// Thẻ tín dụng/ghi nợ
        /// </summary>
        Card = 3
    }
}
