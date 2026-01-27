Tôi cần bạn lên plan chi tiết để triển khai app này theo từng todo list, từng phase, chia chi tiết nhất cho thể giúp tôi. Lưu ý phần mobile sẽ triển khai ở phase sau. Source code tôi đã setup sẵn hết rồi, bây giờ chỉ cần implement theo structure thôi.

Tech stack:

    + API: .NET, EF Core

    + Database: Postgres

    + Admin: Reactjs + TailwindCss + Shadcn

    + Mobile: React Native Expo

Hiện tại tôi muốn triển khai một hệ thống bán hàng đơn giản như sau:

- Backend là một server API .NET

- Front-end là một trang quản lý cửa hàng đơn giản

- Mobile app là app nhân viên sẽ tạo đơn hàng, in hóa đơn, tạo thanh toán

Nghiệp vụ:

- Một app này tương ứng với 1 shop tại quầy.

- Quản lý một cửa hàng bán nước cơ bản:
  - Danh mục: Ví dụ như Trà sữa, Cà phê, Hồng Trà, Trà Trái Cây,...

  - Sản phẩm: Là sản phẩm thuộc 1 danh mục bên trên
    - Sản phẩm cần có thêm size sẽ khác giá tiền

  - Topping: Đi kèm theo đơn, là 1 entity riêng, có thể dính vào sản phẩm. Kiểu món A có Topping B và Topping C.

  - Đơn hàng: Đơn đặt hàng như bình thường, có tổng tiền, có thể tùy chọn thêm VAT hoặc không

  - Có apply khuyến mãi đơn giản dạng vouncher, phía Mobile App sẽ nhập trước khi submit đơn. Sau đó sẽ ra tổng tiền cuối cùng.

- Phía admin site:
  - Quản lý các thực thể trên

  - Xem các queue Order

  - Xem doanh thu thông qua dashboard

  - Có connect socket để app mobile connect vào và đặt đơn real-time

- Phía Mobile App:
  - Load các sản phẩm, danh mục

  - Tạo đơn hàng, Xác nhận đơn hàng và In hóa đơn

  - Connect Socket tới Admin Site để bắn đơn Real-time

Đây là version 1.0 MVP để tôi đi demo trước cho khách hàng.
