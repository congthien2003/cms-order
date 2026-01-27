namespace Domain.Entities.Enums
{
    /// <summary>
    /// Trạng thái đơn hàng
    /// </summary>
    public enum OrderStatus
    {
        /// <summary>
        /// Đơn hàng mới, chờ xác nhận
        /// </summary>
        Pending = 1,

        /// <summary>
        /// Đã xác nhận đơn hàng
        /// </summary>
        Confirmed = 2,

        /// <summary>
        /// Đang chuẩn bị (pha chế)
        /// </summary>
        Preparing = 3,

        /// <summary>
        /// Đã sẵn sàng để giao/lấy
        /// </summary>
        Ready = 4,

        /// <summary>
        /// Đã hoàn thành
        /// </summary>
        Completed = 5,

        /// <summary>
        /// Đã hủy
        /// </summary>
        Cancelled = 6
    }
}
