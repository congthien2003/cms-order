export type Locale = "en" | "vi";

export const translations = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      techStack: "Tech Stack",
      contact: "Contact",
      getStarted: "Get Started",
    },
    hero: {
      badge: "POS System for Beverage Shops",
      title1: "Your Shop,",
      title2: "Perfectly Ordered",
      description:
        "A complete POS solution for beverage shops. Manage orders in real-time, track your menu, and grow your revenue — all from one elegant platform.",
      exploreFeatures: "Explore Features →",
      seeHowItWorks: "See How It Works",
      stats: [
        { value: "Real-time", label: "Order sync" },
        { value: "Multi-size", label: "Product variants" },
        { value: "Topping", label: "Customization" },
        { value: "Dashboard", label: "Analytics" },
      ],
    },
    features: {
      sectionLabel: "Core Features",
      title1: "Everything you need to",
      title2: "run a modern shop",
      description:
        "Built for speed, designed for simplicity. Every feature crafted to keep your shop flowing.",
      items: [
        {
          icon: "📋",
          title: "Smart Order Management",
          desc: "Create, track, and manage orders with lightning speed. Real-time status updates keep your team in sync.",
          tag: "Core",
        },
        {
          icon: "🧋",
          title: "Product & Menu Builder",
          desc: "Organize categories, products with multiple sizes and toppings. Manage your entire menu with ease.",
          tag: "Menu",
        },
        {
          icon: "🎟",
          title: "Voucher & Promotions",
          desc: "Create discount codes with flexible rules — percentage or fixed, with usage limits and date ranges.",
          tag: "Marketing",
        },
        {
          icon: "📊",
          title: "Revenue Dashboard",
          desc: "Track daily revenue, top-selling products, and order trends with beautiful real-time analytics.",
          tag: "Analytics",
        },
        {
          icon: "📱",
          title: "Mobile Staff App",
          desc: "Staff take orders on mobile, apply vouchers, and print receipts. Seamlessly synced to the admin.",
          tag: "Mobile",
        },
        {
          icon: "⚡",
          title: "Real-time Queue",
          desc: "Live order queue with Kanban board. New orders appear instantly — no refresh needed.",
          tag: "Real-time",
        },
      ],
    },
    howItWorks: {
      sectionLabel: "Workflow",
      title1: "From order to",
      title2: "delivery in seconds",
      steps: [
        {
          step: "01",
          title: "Staff Takes the Order",
          desc: "Mobile staff app loads the full menu with categories, products, sizes and toppings. Staff customizes the order and applies voucher codes.",
          side: "left",
        },
        {
          step: "02",
          title: "Order Syncs to Admin",
          desc: "Order is instantly broadcast via Socket.IO to the admin dashboard. The order queue updates in real-time — no polling, no delay.",
          side: "right",
        },
        {
          step: "03",
          title: "Kitchen Prepares & Updates Status",
          desc: "Admin marks orders from Pending → Confirmed → Preparing → Ready. Staff and customers see live status changes.",
          side: "left",
        },
        {
          step: "04",
          title: "Payment & Receipt Printed",
          desc: "Staff processes payment (Cash, Card, Bank Transfer). Receipt is printed via Bluetooth printer with all order details and VAT.",
          side: "right",
        },
      ],
    },
    techStack: {
      sectionLabel: "Under The Hood",
      title1: "Built with the",
      title2: "best tools available",
      stacks: [
        {
          category: "Backend",
          icon: "⚙️",
          items: [".NET 8", "Entity Framework Core", "PostgreSQL", "Clean Architecture"],
        },
        {
          category: "Admin Panel",
          icon: "🖥",
          items: ["React 18", "TailwindCSS", "Shadcn UI", "React Router"],
        },
        {
          category: "Mobile App",
          icon: "📱",
          items: ["React Native", "Expo", "Socket.IO Client", "Secure Storage"],
        },
        {
          category: "Infrastructure",
          icon: "🔧",
          items: ["Socket.IO / SignalR", "JWT Auth", "REST API", "Docker Ready"],
        },
      ],
    },
    preview: {
      sectionLabel: "Interface Preview",
      title1: "Clean. Fast.",
      title2: "Intuitive by design",
      sidebar: ["Dashboard", "Orders", "Products", "Categories", "Toppings", "Vouchers", "Settings"],
      stats: [
        { label: "Today Revenue", value: "₫2,450,000", up: true, trend: "↑ +12% vs yesterday" },
        { label: "Orders Today", value: "47", up: true, trend: "↑ +12% vs yesterday" },
        { label: "Pending Queue", value: "8", up: false, trend: "⏳ Processing" },
      ],
      recentOrders: "Recent Orders",
      viewAll: "View all →",
    },
    cta: {
      title1: "Ready to brew",
      title2: "something great?",
      description:
        "Start managing your beverage shop with a system built for speed and simplicity. Designed for the Vietnamese market, ready for growth.",
      viewGitHub: "View on GitHub",
      exploreFeatures: "Explore Features",
    },
    footer: {
      copyright: "© 2026 BrewOrder · CMS Order Management System · Built with ❤️ for beverage shops",
      links: ["GitHub", "Docs", "API"],
    },
  },
  vi: {
    nav: {
      features: "Tính năng",
      howItWorks: "Cách hoạt động",
      techStack: "Công nghệ",
      contact: "Liên hệ",
      getStarted: "Bắt đầu",
    },
    hero: {
      badge: "Hệ thống POS cho quán nước",
      title1: "Quán của bạn,",
      title2: "Quản lý hoàn hảo",
      description:
        "Giải pháp POS toàn diện cho quán nước. Quản lý đơn hàng theo thời gian thực, theo dõi menu và tăng doanh thu — tất cả trong một nền tảng gọn gàng.",
      exploreFeatures: "Khám phá tính năng →",
      seeHowItWorks: "Xem cách hoạt động",
      stats: [
        { value: "Thời gian thực", label: "Đồng bộ đơn" },
        { value: "Đa kích cỡ", label: "Biến thể sản phẩm" },
        { value: "Topping", label: "Tùy chỉnh thức uống" },
        { value: "Dashboard", label: "Phân tích dữ liệu" },
      ],
    },
    features: {
      sectionLabel: "Tính năng nổi bật",
      title1: "Mọi thứ bạn cần để",
      title2: "vận hành quán hiện đại",
      description:
        "Xây dựng cho tốc độ, thiết kế cho sự đơn giản. Mỗi tính năng được tạo ra để giữ cho quán bạn luôn vận hành trơn tru.",
      items: [
        {
          icon: "📋",
          title: "Quản lý đơn hàng thông minh",
          desc: "Tạo, theo dõi và quản lý đơn hàng với tốc độ vượt trội. Cập nhật trạng thái theo thời gian thực giữ toàn đội ngũ đồng bộ.",
          tag: "Cốt lõi",
        },
        {
          icon: "🧋",
          title: "Xây dựng sản phẩm & Menu",
          desc: "Phân loại danh mục, sản phẩm với nhiều kích thước và topping. Quản lý toàn bộ menu một cách dễ dàng.",
          tag: "Menu",
        },
        {
          icon: "🎟",
          title: "Voucher & Khuyến mãi",
          desc: "Tạo mã giảm giá linh hoạt — theo phần trăm hoặc cố định, với giới hạn sử dụng và thời hạn áp dụng.",
          tag: "Marketing",
        },
        {
          icon: "📊",
          title: "Dashboard doanh thu",
          desc: "Theo dõi doanh thu hàng ngày, sản phẩm bán chạy và xu hướng đơn hàng với phân tích trực quan theo thời gian thực.",
          tag: "Phân tích",
        },
        {
          icon: "📱",
          title: "Ứng dụng nhân viên mobile",
          desc: "Nhân viên nhận đơn trên điện thoại, áp dụng voucher và in hóa đơn. Đồng bộ liền mạch với admin.",
          tag: "Mobile",
        },
        {
          icon: "⚡",
          title: "Hàng chờ thời gian thực",
          desc: "Hàng chờ đơn hàng trực tiếp với bảng Kanban. Đơn hàng mới xuất hiện ngay lập tức — không cần tải lại trang.",
          tag: "Thời gian thực",
        },
      ],
    },
    howItWorks: {
      sectionLabel: "Quy trình",
      title1: "Từ đơn hàng đến",
      title2: "giao hàng trong vài giây",
      steps: [
        {
          step: "01",
          title: "Nhân viên nhận đơn",
          desc: "Ứng dụng nhân viên tải đầy đủ menu với danh mục, sản phẩm, kích cỡ và topping. Nhân viên tùy chỉnh đơn hàng và áp dụng mã voucher.",
          side: "left",
        },
        {
          step: "02",
          title: "Đơn hàng đồng bộ đến Admin",
          desc: "Đơn hàng được phát sóng ngay lập tức qua Socket.IO đến bảng điều khiển admin. Hàng chờ cập nhật theo thời gian thực — không delay.",
          side: "right",
        },
        {
          step: "03",
          title: "Bếp chuẩn bị & cập nhật trạng thái",
          desc: "Admin chuyển đơn hàng từ Chờ xác nhận → Đã xác nhận → Đang chuẩn bị → Sẵn sàng. Nhân viên và khách hàng thấy thay đổi trực tiếp.",
          side: "left",
        },
        {
          step: "04",
          title: "Thanh toán & In hóa đơn",
          desc: "Nhân viên xử lý thanh toán (Tiền mặt, Thẻ, Chuyển khoản). Hóa đơn được in qua máy in Bluetooth với đầy đủ chi tiết đơn hàng và VAT.",
          side: "right",
        },
      ],
    },
    techStack: {
      sectionLabel: "Công nghệ sử dụng",
      title1: "Xây dựng bằng",
      title2: "những công nghệ tốt nhất",
      stacks: [
        {
          category: "Backend",
          icon: "⚙️",
          items: [".NET 8", "Entity Framework Core", "PostgreSQL", "Kiến trúc sạch"],
        },
        {
          category: "Bảng điều khiển",
          icon: "🖥",
          items: ["React 18", "TailwindCSS", "Shadcn UI", "React Router"],
        },
        {
          category: "Ứng dụng mobile",
          icon: "📱",
          items: ["React Native", "Expo", "Socket.IO Client", "Secure Storage"],
        },
        {
          category: "Hạ tầng",
          icon: "🔧",
          items: ["Socket.IO / SignalR", "JWT Auth", "REST API", "Docker Ready"],
        },
      ],
    },
    preview: {
      sectionLabel: "Giao diện minh họa",
      title1: "Gọn gàng. Nhanh chóng.",
      title2: "Trực quan theo thiết kế",
      sidebar: ["Dashboard", "Đơn hàng", "Sản phẩm", "Danh mục", "Topping", "Voucher", "Cài đặt"],
      stats: [
        { label: "Doanh thu hôm nay", value: "₫2,450,000", up: true, trend: "↑ +12% so với hôm qua" },
        { label: "Đơn hàng hôm nay", value: "47", up: true, trend: "↑ +12% so với hôm qua" },
        { label: "Hàng chờ", value: "8", up: false, trend: "⏳ Đang xử lý" },
      ],
      recentOrders: "Đơn hàng gần đây",
      viewAll: "Xem tất cả →",
    },
    cta: {
      title1: "Sẵn sàng bắt đầu",
      title2: "điều gì đó tuyệt vời?",
      description:
        "Bắt đầu quản lý quán nước của bạn với hệ thống được xây dựng cho tốc độ và sự đơn giản. Thiết kế cho thị trường Việt Nam, sẵn sàng cho tăng trưởng.",
      viewGitHub: "Xem trên GitHub",
      exploreFeatures: "Khám phá tính năng",
    },
    footer: {
      copyright: "© 2026 BrewOrder · Hệ thống quản lý CMS · Được xây dựng với ❤️ cho các quán nước",
      links: ["GitHub", "Docs", "API"],
    },
  },
};
