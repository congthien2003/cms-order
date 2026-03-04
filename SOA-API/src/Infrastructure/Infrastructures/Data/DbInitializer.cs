using Domain.Entities;
using Domain.Entities.Enums;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Shared.Helpers;

namespace Infrastructures.Data
{
    /// <summary>
    /// Database initializer for seeding initial data
    /// </summary>
    public static class DbInitializer
    {
        /// <summary>
        /// Seeds initial data into the database
        /// </summary>
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Ensure database is created
            await context.Database.MigrateAsync();

            await SeedRolesAsync(context);

            await SeedUsersAsync(context);
            
            // Seed Shop Settings (Singleton)
            await SeedShopSettingsAsync(context);

            // ============================================================
            // SHOP SEED DATA - Uncomment the shop you want to seed
            // ============================================================

            // Option 1: Mayya Shop - Trà sữa, milo, hồng trà, lục trà, nhiều món lạ, nhiều topping
            await SeedMayyaShopAsync(context);

            // Option 2: Hồng Trà Quán - Hồng trà, lục trà, một vài món trà sữa, nhiều topping
            // await SeedHongTraQuanAsync(context);

            // Option 3: OKE Shop - Trà sữa truyền thống, topping đơn giản
            // await SeedOKEShopAsync(context);

            // ============================================================
            // DEFAULT SEED DATA (Original sample data)
            // ============================================================

            await context.SaveChangesAsync();
        }

        private static async Task SeedRolesAsync(ApplicationDbContext context)
        {
            if (await context.Roles.AnyAsync())
                return;

            var roles = new List<Role>
            {
                Role.Create("Admin", "Administrator with full access"),
                Role.Create("Manager", "Store manager"),
                Role.Create("Staff", "Store staff"),
                Role.Create("Customer", "Customer account")
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        private static async Task SeedUsersAsync(ApplicationDbContext context)
        {
            if (await context.Users.AnyAsync())
                return;

            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole == null)
                return;

            // Create admin user
            // Password: Admin@123
            var passwordHash = Hashing.HashPassword("Admin@123", out byte[] salt);
            var saltString = Convert.ToBase64String(salt);

            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                UserName = "admin",
                FullName = "System Administrator",
                Email = "admin@storeorder.com",
                PasswordHash = passwordHash,
                Salting = saltString,
                IsEmailConfirmed = true,
                PhoneNumber = "0123456789",
                IsPhoneNumberConfirmed = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedById = null
            };

            adminUser.AddRole(adminRole);

            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        private static async Task SeedShopSettingsAsync(ApplicationDbContext context)
        {
            if (await context.ShopSettings.AnyAsync())
                return;

            var shopSetting = new ShopSetting(
                shopName: "Coffee & Milk Tea Shop",
                address: "123 Main Street, District 1, Ho Chi Minh City",
                phone: "0901234567",
                email: "contact@coffeeshop.com",
                defaultVATPercentage: 8,
                isVATEnabled: true,
                logo: null,
                receiptFooter: "Thank you for your order!\nVisit us again soon!"
            );

            await context.ShopSettings.AddAsync(shopSetting);
        }

        private static async Task SeedCategoriesAsync(ApplicationDbContext context)
        {
            if (await context.Set<Category>().AnyAsync())
                return;

            var categories = new[]
            {
                new Category("Coffee", "Hot and Iced Coffee", 1),
                new Category("Milk Tea", "Various Milk Tea flavors", 2),
                new Category("Smoothies", "Fresh Fruit Smoothies", 3),
                new Category("Snacks", "Light snacks and desserts", 4)
            };

            await context.Set<Category>().AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        private static async Task SeedToppingsAsync(ApplicationDbContext context)
        {
            if (await context.Toppings.AnyAsync())
                return;

            var toppings = new[]
            {
                new Topping("Pearl (Trân châu)", 5000, null, 1),
                new Topping("Pudding", 7000, null, 2),
                new Topping("Jelly", 5000, null, 3),
                new Topping("Cheese Foam", 10000, null, 4),
                new Topping("Fresh Milk", 8000, null, 5)
            };

            await context.Toppings.AddRangeAsync(toppings);
            await context.SaveChangesAsync();
        }

        private static async Task SeedProductsAsync(ApplicationDbContext context)
        {
            if (await context.Products.AnyAsync())
                return;

            var coffeeCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Coffee");
            var milkTeaCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Milk Tea");
            var smoothieCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Smoothies");

            var allToppings = await context.Toppings.ToListAsync();

            // Coffee Products
            var espresso = new Product(coffeeCategory.Id, "Espresso", 35000, "Classic Italian espresso", null, 1);
            await context.Products.AddAsync(espresso);
            await context.SaveChangesAsync();

            var espressoSizes = new[]
            {
                new ProductSize(espresso.Id, "Small", 0, true),
                new ProductSize(espresso.Id, "Medium", 5000, false),
                new ProductSize(espresso.Id, "Large", 10000, false)
            };
            await context.ProductSizes.AddRangeAsync(espressoSizes);

            var cappuccino = new Product(coffeeCategory.Id, "Cappuccino", 45000, "Espresso with steamed milk foam", null, 2);
            await context.Products.AddAsync(cappuccino);
            await context.SaveChangesAsync();

            var cappuccinoSizes = new[]
            {
                new ProductSize(cappuccino.Id, "Small", 0, true),
                new ProductSize(cappuccino.Id, "Medium", 5000, false),
                new ProductSize(cappuccino.Id, "Large", 10000, false)
            };
            await context.ProductSizes.AddRangeAsync(cappuccinoSizes);

            // Milk Tea Products
            var classicMilkTea = new Product(milkTeaCategory.Id, "Classic Milk Tea", 40000, "Traditional milk tea", null, 1);
            await context.Products.AddAsync(classicMilkTea);
            await context.SaveChangesAsync();

            var classicSizes = new[]
            {
                new ProductSize(classicMilkTea.Id, "Medium", 0, true),
                new ProductSize(classicMilkTea.Id, "Large", 10000, false)
            };
            await context.ProductSizes.AddRangeAsync(classicSizes);

            // Add toppings to Classic Milk Tea
            var milkTeaToppingIds = allToppings
                .Where(t => t.Name.Contains("Pearl") || t.Name.Contains("Pudding") || t.Name.Contains("Jelly"))
                .Select(t => t.Id)
                .ToList();

            foreach (var toppingId in milkTeaToppingIds)
            {
                var productTopping = new ProductTopping(classicMilkTea.Id, toppingId, false);
                await context.ProductToppings.AddAsync(productTopping);
            }

            var thaiMilkTea = new Product(milkTeaCategory.Id, "Thai Milk Tea", 45000, "Thai style milk tea", null, 2);
            await context.Products.AddAsync(thaiMilkTea);
            await context.SaveChangesAsync();

            var thaiSizes = new[]
            {
                new ProductSize(thaiMilkTea.Id, "Medium", 0, true),
                new ProductSize(thaiMilkTea.Id, "Large", 10000, false)
            };
            await context.ProductSizes.AddRangeAsync(thaiSizes);

            // Smoothie Products
            var mangoSmoothie = new Product(smoothieCategory.Id, "Mango Smoothie", 50000, "Fresh mango smoothie", null, 1);
            await context.Products.AddAsync(mangoSmoothie);
            await context.SaveChangesAsync();

            var mangoSizes = new[]
            {
                new ProductSize(mangoSmoothie.Id, "Medium", 0, true),
                new ProductSize(mangoSmoothie.Id, "Large", 15000, false)
            };
            await context.ProductSizes.AddRangeAsync(mangoSizes);

            await context.SaveChangesAsync();
        }

        private static async Task SeedVouchersAsync(ApplicationDbContext context)
        {
            if (await context.Vouchers.AnyAsync())
                return;

            var vouchers = new List<Voucher>();

            // Welcome Voucher - 10% discount
            var startDate1 = new DateTime(2026, 1, 1);
            var endDate1 = new DateTime(2026, 12, 31);
            var welcome = new Voucher(
                code: "WELCOME10",
                name: "Welcome Discount 10%",
                discountType: DiscountType.Percentage,
                discountValue: 10,
                startDate: startDate1,
                endDate: endDate1,
                description: "Get 10% off on your first order",
                minOrderAmount: 50000,
                maxDiscountAmount: 20000,
                usageLimit: 100
            );
            vouchers.Add(welcome);

            // New Year Voucher - Fixed 50k discount
            var startDate2 = new DateTime(2026, 1, 1);
            var endDate2 = new DateTime(2026, 2, 28);
            var newYear = new Voucher(
                code: "NEWYEAR2026",
                name: "New Year Promotion",
                discountType: DiscountType.FixedAmount,
                discountValue: 50000,
                startDate: startDate2,
                endDate: endDate2,
                description: "Celebrate new year with 50k discount",
                minOrderAmount: 200000,
                maxDiscountAmount: null,
                usageLimit: 50
            );
            vouchers.Add(newYear);

            // Free Shipping Voucher
            var startDate3 = new DateTime(2026, 1, 15);
            var endDate3 = new DateTime(2026, 6, 30);
            var freeShip = new Voucher(
                code: "FREESHIP",
                name: "Free Shipping",
                discountType: DiscountType.FixedAmount,
                discountValue: 30000,
                startDate: startDate3,
                endDate: endDate3,
                description: "Free shipping for orders over 100k",
                minOrderAmount: 100000,
                maxDiscountAmount: null,
                usageLimit: 200
            );
            vouchers.Add(freeShip);

            await context.Vouchers.AddRangeAsync(vouchers);
            await context.SaveChangesAsync();
        }

        #region ============================================================
        // MAYYA SHOP - Quán trà sữa, milo, hồng trà, lục trà, nhiều món lạ, nhiều topping
        #endregion
        /// <summary>
        /// Seed data for Mayya Shop - Trà sữa, milo, hồng trà, lục trà, nhiều món lạ, nhiều topping
        /// Đặc trưng: Menu đa dạng với nhiều loại đồ uống và topping phong phú
        /// </summary>
        private static async Task SeedMayyaShopAsync(ApplicationDbContext context)
        {
            // Seed Categories for Mayya Shop
            await SeedMayyaCategoriesAsync(context);

            // Seed Toppings for Mayya Shop
            await SeedMayyaToppingsAsync(context);

            // Seed Products for Mayya Shop
            await SeedMayyaProductsAsync(context);

            // Seed Vouchers for Mayya Shop
            await SeedMayyaVouchersAsync(context);

            await context.SaveChangesAsync();
        }

        private static async Task SeedMayyaCategoriesAsync(ApplicationDbContext context)
        {
            if (await context.Set<Category>().AnyAsync())
                return;

            var categories = new[]
            {
                new Category("Trà Sữa", "Các loại trà sữa đặc biệt của Mayya", 1),
                new Category("Hồng Trà", "Các loại hồng trà thơm ngon", 2),
                new Category("Lục Trà", "Các loại trà xanh matcha tươi mát", 3),
                new Category("Milo & Cacao", "Các loại thức uống Milo và Cacao", 4),
                new Category("Đồ Uống Đặc Biệt", "Các món đồ uống độc đáo của Mayya", 5),
                new Category("Sữa Tươi & Yogurt", "Các loại sữa tươi và yogurt thơm ngon", 6),
                new Category("Trà Trái Cây", "Các loại trà kết hợp trái cây tươi", 7)
            };

            await context.Set<Category>().AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        private static async Task SeedMayyaToppingsAsync(ApplicationDbContext context)
        {
            if (await context.Toppings.AnyAsync())
                return;

            var toppings = new[]
            {
                // Trân châu các loại
                new Topping("Trân châu đen", 8000, null, 1),
                new Topping("Trân châu trắng", 8000, null, 2),
                new Topping("Trân châu hoàng kim", 10000, null, 3),
                new Topping("Trân châu phô mai", 12000, null, 4),
                
                // Thạch các loại
                new Topping("Thạch dừa", 6000, null, 5),
                new Topping("Thạch nha đam", 6000, null, 6),
                new Topping("Thạch trái cây", 8000, null, 7),
                new Topping("Thạch rau câu", 6000, null, 8),
                new Topping("Thạch phô mai", 10000, null, 9),
                
                // Pudding & Flan
                new Topping("Pudding trứng", 10000, null, 10),
                new Topping("Pudding matcha", 12000, null, 11),
                new Topping("Flan caramel", 12000, null, 12),
                
                // Kem & Foam
                new Topping("Kem cheese", 15000, null, 13),
                new Topping("Foam phô mai", 12000, null, 14),
                new Topping("Kem tươi", 10000, null, 15),
                new Topping("Whipping cream", 8000, null, 16),
                
                // Topping đặc biệt
                new Topping("Đậu đỏ", 8000, null, 17),
                new Topping("Khoai môn", 8000, null, 18),
                new Topping("Sương sáo", 6000, null, 19),
                new Topping("Hạt é", 5000, null, 20),
                new Topping("Sữa tươi", 8000, null, 21),
                new Topping("Shot espresso", 15000, null, 22)
            };

            await context.Toppings.AddRangeAsync(toppings);
            await context.SaveChangesAsync();
        }

        private static async Task SeedMayyaProductsAsync(ApplicationDbContext context)
        {
            if (await context.Products.AnyAsync())
                return;

            var trasuaCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Sữa");
            var hongtraCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Hồng Trà");
            var luctraCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Lục Trà");
            var miloCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Milo & Cacao");
            var dacbietCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Đồ Uống Đặc Biệt");
            var suatuoiCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Sữa Tươi & Yogurt");
            var traTraiCayCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Trái Cây");

            var allToppings = await context.Toppings.ToListAsync();

            // ============================================================
            // TRÀ SỮA
            // ============================================================
            var trasuaProducts = new[]
            {
                new Product(trasuaCategory.Id, "Trà Sữa Trân Châu Đường Đen", 35000, "Trà sữa kết hợp đường đen thơm ngon với trân châu dai mềm", null, 1),
                new Product(trasuaCategory.Id, "Trà Sữa Matcha", 38000, "Trà sữa vị matcha Nhật Bản đậm đà", null, 2),
                new Product(trasuaCategory.Id, "Trà Sữa Khoai Môn", 35000, "Trà sữa khoai môn béo ngậy thơm ngon", null, 3),
                new Product(trasuaCategory.Id, "Trà Sữa Pudding", 38000, "Trà sữa với pudding trứng mềm mịn", null, 4),
                new Product(trasuaCategory.Id, "Trà Sữa Hokkaido", 42000, "Trà sữa Hokkaido Nhật Bản béo ngậy", null, 5),
                new Product(trasuaCategory.Id, "Trà Sữa Okinawa", 42000, "Trà sữa đường nâu Okinawa đặc biệt", null, 6),
                new Product(trasuaCategory.Id, "Trà Sữa Phô Mai", 45000, "Trà sữa với kem phô mai béo ngậy", null, 7),
                new Product(trasuaCategory.Id, "Trà Sữa Socola", 35000, "Trà sữa vị socola đậm đà", null, 8)
            };

            foreach (var product in trasuaProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                // Add sizes
                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                // Add toppings (trân châu, thạch, pudding)
                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Trân châu") || t.Name.Contains("Thạch") || t.Name.Contains("Pudding") || t.Name.Contains("Kem cheese"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // HỒNG TRÀ
            // ============================================================
            var hongtraProducts = new[]
            {
                new Product(hongtraCategory.Id, "Hồng Trà Sữa", 30000, "Hồng trà sữa truyền thống thơm ngon", null, 1),
                new Product(hongtraCategory.Id, "Hồng Trà Đào", 32000, "Hồng trà kết hợp đào tươi mát", null, 2),
                new Product(hongtraCategory.Id, "Hồng Trà Vải", 32000, "Hồng trà với vị vải ngọt thanh", null, 3),
                new Product(hongtraCategory.Id, "Hồng Trà Kem Cheese", 40000, "Hồng trà với lớp kem cheese béo ngậy", null, 4),
                new Product(hongtraCategory.Id, "Hồng Trà Chanh Leo", 32000, "Hồng trà chanh leo chua ngọt", null, 5),
                new Product(hongtraCategory.Id, "Hồng Trà Lài", 28000, "Hồng trà hoa lài thơm dịu", null, 6)
            };

            foreach (var product in hongtraProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Trân châu") || t.Name.Contains("Hạt é"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // LỤC TRÀ / MATCHA
            // ============================================================
            var luctraProducts = new[]
            {
                new Product(luctraCategory.Id, "Lục Trà Sữa", 32000, "Trà xanh sữa truyền thống", null, 1),
                new Product(luctraCategory.Id, "Matcha Latte", 42000, "Matcha latte Nhật Bản đậm đà", null, 2),
                new Product(luctraCategory.Id, "Lục Trà Chanh Mật Ong", 30000, "Lục trà kết hợp chanh và mật ong", null, 3),
                new Product(luctraCategory.Id, "Matcha Đá Xay", 45000, "Matcha đá xay thơm mát", null, 4),
                new Product(luctraCategory.Id, "Trà Xanh Đào", 32000, "Trà xanh với đào tươi", null, 5),
                new Product(luctraCategory.Id, "Matcha Kem Cheese", 48000, "Matcha với lớp kem cheese béo ngậy", null, 6)
            };

            foreach (var product in luctraProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Pudding matcha") || t.Name.Contains("Kem"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // MILO & CACAO
            // ============================================================
            var miloProducts = new[]
            {
                new Product(miloCategory.Id, "Milo Dầm", 35000, "Milo dầm đá thơm ngon", null, 1),
                new Product(miloCategory.Id, "Milo Dino", 38000, "Milo dino với lớp bột Milo trên top", null, 2),
                new Product(miloCategory.Id, "Milo Trân Châu", 40000, "Milo với trân châu dai mềm", null, 3),
                new Product(miloCategory.Id, "Milo Kem Cheese", 45000, "Milo với kem cheese béo ngậy", null, 4),
                new Product(miloCategory.Id, "Cacao Nóng", 32000, "Cacao nóng thơm lừng", null, 5),
                new Product(miloCategory.Id, "Cacao Đá", 32000, "Cacao đá mát lạnh", null, 6),
                new Product(miloCategory.Id, "Cacao Kem Cheese", 42000, "Cacao với kem cheese béo ngậy", null, 7)
            };

            foreach (var product in miloProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Trân châu") || t.Name.Contains("Kem") || t.Name.Contains("Whipping"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // ĐỒ UỐNG ĐẶC BIỆT
            // ============================================================
            var dacbietProducts = new[]
            {
                new Product(dacbietCategory.Id, "Trà Sữa Than Hoạt Tính", 45000, "Trà sữa với than hoạt tính detox", null, 1),
                new Product(dacbietCategory.Id, "Trà Sữa Lavender", 42000, "Trà sữa hoa oải hương thơm dịu", null, 2),
                new Product(dacbietCategory.Id, "Trà Sữa Hoa Hồng", 42000, "Trà sữa hoa hồng lãng mạn", null, 3),
                new Product(dacbietCategory.Id, "Trà Sữa Bạc Hà", 38000, "Trà sữa bạc hà mát lạnh", null, 4),
                new Product(dacbietCategory.Id, "Soda Ý Chanh Leo", 35000, "Soda Ý với chanh leo tươi mát", null, 5),
                new Product(dacbietCategory.Id, "Soda Ý Dâu", 35000, "Soda Ý vị dâu tây ngọt ngào", null, 6),
                new Product(dacbietCategory.Id, "Smoothie Xoài", 45000, "Sinh tố xoài tươi mát", null, 7),
                new Product(dacbietCategory.Id, "Smoothie Dâu", 45000, "Sinh tố dâu tây thơm ngon", null, 8)
            };

            foreach (var product in dacbietProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 10000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Hạt é") || t.Name.Contains("Nha đam"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // SỮA TƯƠI & YOGURT
            // ============================================================
            var suatuoiProducts = new[]
            {
                new Product(suatuoiCategory.Id, "Sữa Tươi Trân Châu Đường Đen", 35000, "Sữa tươi với trân châu và đường đen", null, 1),
                new Product(suatuoiCategory.Id, "Sữa Tươi Matcha", 38000, "Sữa tươi matcha Nhật Bản", null, 2),
                new Product(suatuoiCategory.Id, "Yogurt Đá Xay", 40000, "Yogurt đá xay mát lạnh", null, 3),
                new Product(suatuoiCategory.Id, "Yogurt Trái Cây", 42000, "Yogurt với trái cây tươi", null, 4),
                new Product(suatuoiCategory.Id, "Sữa Chua Nếp Cẩm", 38000, "Sữa chua với nếp cẩm dẻo", null, 5)
            };

            foreach (var product in suatuoiProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Trân châu") || t.Name.Contains("Thạch") || t.Name.Contains("Đậu đỏ"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // TRÀ TRÁI CÂY
            // ============================================================
            var traTraiCayProducts = new[]
            {
                new Product(traTraiCayCategory.Id, "Trà Đào Cam Sả", 35000, "Trà đào kết hợp cam và sả thơm mát", null, 1),
                new Product(traTraiCayCategory.Id, "Trà Vải", 32000, "Trà vải ngọt thanh", null, 2),
                new Product(traTraiCayCategory.Id, "Trà Chanh Leo", 30000, "Trà chanh leo chua ngọt", null, 3),
                new Product(traTraiCayCategory.Id, "Trà Dâu", 32000, "Trà dâu tây tươi mát", null, 4),
                new Product(traTraiCayCategory.Id, "Trà Bưởi Hồng", 35000, "Trà bưởi hồng thanh mát", null, 5),
                new Product(traTraiCayCategory.Id, "Trà Táo", 32000, "Trà táo thơm ngọt", null, 6)
            };

            foreach (var product in traTraiCayProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Hạt é") || t.Name.Contains("Nha đam"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedMayyaVouchersAsync(ApplicationDbContext context)
        {
            if (await context.Vouchers.AnyAsync())
                return;

            var vouchers = new List<Voucher>();

            var welcome = new Voucher(
                code: "MAYYA10",
                name: "Mayya Welcome 10%",
                discountType: DiscountType.Percentage,
                discountValue: 10,
                startDate: new DateTime(2026, 1, 1),
                endDate: new DateTime(2026, 12, 31),
                description: "Giảm 10% cho đơn hàng đầu tiên tại Mayya",
                minOrderAmount: 50000,
                maxDiscountAmount: 25000,
                usageLimit: 200
            );
            vouchers.Add(welcome);

            var member = new Voucher(
                code: "MAYYAMEMBER",
                name: "Mayya Member 20%",
                discountType: DiscountType.Percentage,
                discountValue: 20,
                startDate: new DateTime(2026, 1, 1),
                endDate: new DateTime(2026, 12, 31),
                description: "Giảm 20% cho thành viên Mayya",
                minOrderAmount: 100000,
                maxDiscountAmount: 50000,
                usageLimit: 100
            );
            vouchers.Add(member);

            await context.Vouchers.AddRangeAsync(vouchers);
            await context.SaveChangesAsync();
        }

        #region ============================================================
        // HỒNG TRÀ QUÁN - Quán hồng trà, lục trà, một vài món trà sữa, nhiều topping
        #endregion
        /// <summary>
        /// Seed data for Hồng Trà Quán - Chuyên hồng trà, lục trà, một vài món trà sữa, nhiều topping
        /// Đặc trưng: Tập trung vào các loại trà hồng, trà xanh chất lượng cao
        /// </summary>
        private static async Task SeedHongTraQuanAsync(ApplicationDbContext context)
        {
            // Seed Categories for Hồng Trà Quán
            await SeedHongTraQuanCategoriesAsync(context);

            // Seed Toppings for Hồng Trà Quán
            await SeedHongTraQuanToppingsAsync(context);

            // Seed Products for Hồng Trà Quán
            await SeedHongTraQuanProductsAsync(context);

            // Seed Vouchers for Hồng Trà Quán
            await SeedHongTraQuanVouchersAsync(context);

            await context.SaveChangesAsync();
        }

        private static async Task SeedHongTraQuanCategoriesAsync(ApplicationDbContext context)
        {
            if (await context.Set<Category>().AnyAsync())
                return;

            var categories = new[]
            {
                new Category("Hồng Trà", "Các loại hồng trà thượng hạng", 1),
                new Category("Lục Trà", "Các loại lục trà xanh mát", 2),
                new Category("Ô Long", "Các loại trà Ô Long đặc sản", 3),
                new Category("Trà Sữa", "Các loại trà sữa đặc biệt", 4),
                new Category("Trà Trái Cây", "Trà kết hợp trái cây tươi", 5),
                new Category("Trà Nóng", "Các loại trà nóng truyền thống", 6)
            };

            await context.Set<Category>().AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        private static async Task SeedHongTraQuanToppingsAsync(ApplicationDbContext context)
        {
            if (await context.Toppings.AnyAsync())
                return;

            var toppings = new[]
            {
                // Trân châu các loại
                new Topping("Trân châu đen", 7000, null, 1),
                new Topping("Trân châu trắng", 7000, null, 2),
                new Topping("Trân châu hoàng kim", 10000, null, 3),
                new Topping("Trân châu hồng trà", 10000, null, 4),
                
                // Thạch các loại
                new Topping("Thạch nha đam", 6000, null, 5),
                new Topping("Thạch dừa", 6000, null, 6),
                new Topping("Thạch hồng trà", 8000, null, 7),
                new Topping("Thạch lục trà", 8000, null, 8),
                new Topping("Thạch trái cây", 7000, null, 9),
                new Topping("Thạch rau câu", 6000, null, 10),
                
                // Pudding
                new Topping("Pudding trứng", 10000, null, 11),
                new Topping("Pudding hồng trà", 12000, null, 12),
                
                // Kem & Foam
                new Topping("Kem cheese", 15000, null, 13),
                new Topping("Kem phô mai", 12000, null, 14),
                new Topping("Foam sữa", 10000, null, 15),
                
                // Topping khác
                new Topping("Đậu đỏ", 8000, null, 16),
                new Topping("Hạt é", 5000, null, 17),
                new Topping("Sương sáo", 6000, null, 18),
                new Topping("Khoai lang", 8000, null, 19),
                new Topping("Sữa tươi", 8000, null, 20)
            };

            await context.Toppings.AddRangeAsync(toppings);
            await context.SaveChangesAsync();
        }

        private static async Task SeedHongTraQuanProductsAsync(ApplicationDbContext context)
        {
            if (await context.Products.AnyAsync())
                return;

            var hongtraCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Hồng Trà");
            var luctraCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Lục Trà");
            var olongCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Ô Long");
            var trasuaCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Sữa");
            var traTraiCayCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Trái Cây");
            var traNongCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Nóng");

            var allToppings = await context.Toppings.ToListAsync();

            // ============================================================
            // HỒNG TRÀ
            // ============================================================
            var hongtraProducts = new[]
            {
                new Product(hongtraCategory.Id, "Hồng Trà Nguyên Chất", 25000, "Hồng trà nguyên chất thượng hạng", null, 1),
                new Product(hongtraCategory.Id, "Hồng Trà Sữa", 30000, "Hồng trà sữa truyền thống", null, 2),
                new Product(hongtraCategory.Id, "Hồng Trà Đào", 32000, "Hồng trà với đào ngọt thanh", null, 3),
                new Product(hongtraCategory.Id, "Hồng Trà Vải", 32000, "Hồng trà với vải tươi mát", null, 4),
                new Product(hongtraCategory.Id, "Hồng Trà Kem Cheese", 40000, "Hồng trà với kem cheese béo ngậy", null, 5),
                new Product(hongtraCategory.Id, "Hồng Trà Chanh", 28000, "Hồng trà chanh thanh mát", null, 6),
                new Product(hongtraCategory.Id, "Hồng Trà Mật Ong", 30000, "Hồng trà với mật ong nguyên chất", null, 7),
                new Product(hongtraCategory.Id, "Hồng Trà Gừng", 28000, "Hồng trà gừng ấm áp", null, 8),
                new Product(hongtraCategory.Id, "Hồng Trà Thạch", 35000, "Hồng trà với thạch hồng trà đặc biệt", null, 9),
                new Product(hongtraCategory.Id, "Hồng Trà Trân Châu", 35000, "Hồng trà với trân châu hồng trà", null, 10)
            };

            foreach (var product in hongtraProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 7000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Trân châu") || t.Name.Contains("Hạt é"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // LỤC TRÀ
            // ============================================================
            var luctraProducts = new[]
            {
                new Product(luctraCategory.Id, "Lục Trà Nguyên Chất", 25000, "Lục trà nguyên chất thơm mát", null, 1),
                new Product(luctraCategory.Id, "Lục Trà Sữa", 32000, "Lục trà sữa truyền thống", null, 2),
                new Product(luctraCategory.Id, "Lục Trà Chanh Mật Ong", 30000, "Lục trà với chanh và mật ong", null, 3),
                new Product(luctraCategory.Id, "Lục Trà Đào", 32000, "Lục trà với đào tươi", null, 4),
                new Product(luctraCategory.Id, "Lục Trà Kem Cheese", 40000, "Lục trà với kem cheese", null, 5),
                new Product(luctraCategory.Id, "Lục Trà Thạch", 35000, "Lục trà với thạch lục trà", null, 6),
                new Product(luctraCategory.Id, "Lục Trà Nhài", 28000, "Lục trà hoa nhài thơm", null, 7),
                new Product(luctraCategory.Id, "Lục Trà Bạc Hà", 30000, "Lục trà bạc hà mát lạnh", null, 8)
            };

            foreach (var product in luctraProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 7000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Nha đam") || t.Name.Contains("Hạt é"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // Ô LONG
            // ============================================================
            var olongProducts = new[]
            {
                new Product(olongCategory.Id, "Ô Long Nguyên Chất", 28000, "Ô Long nguyên chất thượng hạng", null, 1),
                new Product(olongCategory.Id, "Ô Long Sữa", 35000, "Ô Long sữa thơm ngon", null, 2),
                new Product(olongCategory.Id, "Ô Long Đào", 35000, "Ô Long với đào tươi", null, 3),
                new Product(olongCategory.Id, "Ô Long Kem Cheese", 42000, "Ô Long với kem cheese béo ngậy", null, 4),
                new Product(olongCategory.Id, "Ô Long Hạnh Nhân", 38000, "Ô Long với hương hạnh nhân", null, 5)
            };

            foreach (var product in olongProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 7000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Kem") || t.Name.Contains("Pudding"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // TRÀ SỮA
            // ============================================================
            var trasuaProducts = new[]
            {
                new Product(trasuaCategory.Id, "Trà Sữa Truyền Thống", 32000, "Trà sữa truyền thống đậm đà", null, 1),
                new Product(trasuaCategory.Id, "Trà Sữa Trân Châu Đường Đen", 35000, "Trà sữa với trân châu đường đen", null, 2),
                new Product(trasuaCategory.Id, "Trà Sữa Hồng Trà", 35000, "Trà sữa base hồng trà đặc biệt", null, 3),
                new Product(trasuaCategory.Id, "Trà Sữa Kem Cheese", 42000, "Trà sữa với kem cheese béo ngậy", null, 4),
                new Product(trasuaCategory.Id, "Trà Sữa Khoai Môn", 35000, "Trà sữa khoai môn béo ngậy", null, 5)
            };

            foreach (var product in trasuaProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 8000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Trân châu") || t.Name.Contains("Pudding") || t.Name.Contains("Kem"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // TRÀ TRÁI CÂY
            // ============================================================
            var traTraiCayProducts = new[]
            {
                new Product(traTraiCayCategory.Id, "Trà Đào Cam Sả", 32000, "Trà đào kết hợp cam và sả", null, 1),
                new Product(traTraiCayCategory.Id, "Trà Vải", 30000, "Trà vải ngọt thanh", null, 2),
                new Product(traTraiCayCategory.Id, "Trà Chanh Leo", 28000, "Trà chanh leo chua ngọt", null, 3),
                new Product(traTraiCayCategory.Id, "Trà Bưởi", 32000, "Trà bưởi thanh mát", null, 4),
                new Product(traTraiCayCategory.Id, "Trà Dâu", 30000, "Trà dâu tây tươi mát", null, 5)
            };

            foreach (var product in traTraiCayProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 7000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Hạt é") || t.Name.Contains("Nha đam"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // TRÀ NÓNG
            // ============================================================
            var traNongProducts = new[]
            {
                new Product(traNongCategory.Id, "Hồng Trà Nóng", 20000, "Hồng trà nóng nguyên chất", null, 1),
                new Product(traNongCategory.Id, "Lục Trà Nóng", 20000, "Lục trà nóng nguyên chất", null, 2),
                new Product(traNongCategory.Id, "Ô Long Nóng", 22000, "Ô Long nóng thượng hạng", null, 3),
                new Product(traNongCategory.Id, "Trà Gừng Mật Ong", 25000, "Trà gừng với mật ong ấm áp", null, 4),
                new Product(traNongCategory.Id, "Trà Hoa Cúc", 22000, "Trà hoa cúc thanh mát", null, 5),
                new Product(traNongCategory.Id, "Trà Nhài Nóng", 22000, "Trà hoa nhài thơm dịu", null, 6)
            };

            foreach (var product in traNongProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                // Trà nóng chỉ có 1 size
                var sizes = new[]
                {
                    new ProductSize(product.Id, "Nhỏ", 0, true),
                    new ProductSize(product.Id, "Lớn", 5000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedHongTraQuanVouchersAsync(ApplicationDbContext context)
        {
            if (await context.Vouchers.AnyAsync())
                return;

            var vouchers = new List<Voucher>();

            var welcome = new Voucher(
                code: "HONGTRA10",
                name: "Hồng Trà Quán - Giảm 10%",
                discountType: DiscountType.Percentage,
                discountValue: 10,
                startDate: new DateTime(2026, 1, 1),
                endDate: new DateTime(2026, 12, 31),
                description: "Giảm 10% cho đơn hàng đầu tiên",
                minOrderAmount: 40000,
                maxDiscountAmount: 20000,
                usageLimit: 200
            );
            vouchers.Add(welcome);

            var comboTra = new Voucher(
                code: "COMBOTRA",
                name: "Combo Trà - Giảm 15%",
                discountType: DiscountType.Percentage,
                discountValue: 15,
                startDate: new DateTime(2026, 1, 1),
                endDate: new DateTime(2026, 12, 31),
                description: "Giảm 15% khi mua từ 3 ly trà trở lên",
                minOrderAmount: 80000,
                maxDiscountAmount: 30000,
                usageLimit: 100
            );
            vouchers.Add(comboTra);

            await context.Vouchers.AddRangeAsync(vouchers);
            await context.SaveChangesAsync();
        }

        #region ============================================================
        // OKE SHOP - Quán trà sữa truyền thống, topping đơn giản
        #endregion
        /// <summary>
        /// Seed data for OKE Shop - Trà sữa truyền thống, topping đơn giản
        /// Đặc trưng: Menu đơn giản, trà sữa truyền thống với giá phải chăng
        /// </summary>
        private static async Task SeedOKEShopAsync(ApplicationDbContext context)
        {
            // Seed Categories for OKE Shop
            await SeedOKECategoriesAsync(context);

            // Seed Toppings for OKE Shop
            await SeedOKEToppingsAsync(context);

            // Seed Products for OKE Shop
            await SeedOKEProductsAsync(context);

            // Seed Vouchers for OKE Shop
            await SeedOKEVouchersAsync(context);

            await context.SaveChangesAsync();
        }

        private static async Task SeedOKECategoriesAsync(ApplicationDbContext context)
        {
            if (await context.Set<Category>().AnyAsync())
                return;

            var categories = new[]
            {
                new Category("Trà Sữa", "Các loại trà sữa truyền thống", 1),
                new Category("Trà Đào", "Các loại trà đào thơm ngon", 2),
                new Category("Sữa Tươi", "Các loại sữa tươi đa dạng", 3),
                new Category("Đá Xay", "Các loại đá xay mát lạnh", 4)
            };

            await context.Set<Category>().AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        private static async Task SeedOKEToppingsAsync(ApplicationDbContext context)
        {
            if (await context.Toppings.AnyAsync())
                return;

            var toppings = new[]
            {
                // Topping cơ bản - Giá rẻ
                new Topping("Trân châu đen", 5000, null, 1),
                new Topping("Trân châu trắng", 5000, null, 2),
                new Topping("Thạch dừa", 5000, null, 3),
                new Topping("Thạch rau câu", 5000, null, 4),
                new Topping("Pudding", 7000, null, 5),
                new Topping("Sương sáo", 5000, null, 6),
                new Topping("Đậu đỏ", 6000, null, 7),
                new Topping("Sữa tươi", 6000, null, 8)
            };

            await context.Toppings.AddRangeAsync(toppings);
            await context.SaveChangesAsync();
        }

        private static async Task SeedOKEProductsAsync(ApplicationDbContext context)
        {
            if (await context.Products.AnyAsync())
                return;

            var trasuaCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Sữa");
            var tradaoCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Trà Đào");
            var suatuoiCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Sữa Tươi");
            var daxayCategory = await context.Set<Category>().FirstAsync(c => c.Name == "Đá Xay");

            var allToppings = await context.Toppings.ToListAsync();

            // ============================================================
            // TRÀ SỮA
            // ============================================================
            var trasuaProducts = new[]
            {
                new Product(trasuaCategory.Id, "Trà Sữa Truyền Thống", 20000, "Trà sữa truyền thống đậm đà", null, 1),
                new Product(trasuaCategory.Id, "Trà Sữa Trân Châu", 25000, "Trà sữa với trân châu đen dẻo dai", null, 2),
                new Product(trasuaCategory.Id, "Trà Sữa Pudding", 27000, "Trà sữa với pudding mềm mịn", null, 3),
                new Product(trasuaCategory.Id, "Trà Sữa Socola", 25000, "Trà sữa vị socola ngọt ngào", null, 4),
                new Product(trasuaCategory.Id, "Trà Sữa Khoai Môn", 25000, "Trà sữa khoai môn béo ngậy", null, 5),
                new Product(trasuaCategory.Id, "Trà Sữa Matcha", 28000, "Trà sữa vị matcha Nhật", null, 6),
                new Product(trasuaCategory.Id, "Trà Sữa Đường Đen", 27000, "Trà sữa với đường đen thơm", null, 7),
                new Product(trasuaCategory.Id, "Trà Sữa Thái", 25000, "Trà sữa Thái cam đặc trưng", null, 8)
            };

            foreach (var product in trasuaProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 5000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // TRÀ ĐÀO
            // ============================================================
            var tradaoProducts = new[]
            {
                new Product(tradaoCategory.Id, "Trà Đào", 22000, "Trà đào tươi mát", null, 1),
                new Product(tradaoCategory.Id, "Trà Đào Cam Sả", 25000, "Trà đào cam sả thanh mát", null, 2),
                new Product(tradaoCategory.Id, "Trà Vải", 22000, "Trà vải ngọt thanh", null, 3),
                new Product(tradaoCategory.Id, "Trà Chanh Leo", 20000, "Trà chanh leo chua ngọt", null, 4)
            };

            foreach (var product in tradaoProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 5000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Thạch") || t.Name.Contains("Sương"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // SỮA TƯƠI
            // ============================================================
            var suatuoiProducts = new[]
            {
                new Product(suatuoiCategory.Id, "Sữa Tươi Trân Châu Đường Đen", 25000, "Sữa tươi với trân châu đường đen", null, 1),
                new Product(suatuoiCategory.Id, "Sữa Tươi Matcha", 27000, "Sữa tươi vị matcha", null, 2),
                new Product(suatuoiCategory.Id, "Sữa Tươi Socola", 25000, "Sữa tươi vị socola", null, 3),
                new Product(suatuoiCategory.Id, "Sữa Tươi Coffee", 27000, "Sữa tươi cà phê", null, 4)
            };

            foreach (var product in suatuoiProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 5000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);

                var productToppings = allToppings
                    .Where(t => t.Name.Contains("Trân châu") || t.Name.Contains("Pudding"))
                    .Select(t => new ProductTopping(product.Id, t.Id, false));
                await context.ProductToppings.AddRangeAsync(productToppings);
            }

            // ============================================================
            // ĐÁ XAY
            // ============================================================
            var daxayProducts = new[]
            {
                new Product(daxayCategory.Id, "Đá Xay Matcha", 28000, "Đá xay matcha mát lạnh", null, 1),
                new Product(daxayCategory.Id, "Đá Xay Socola", 25000, "Đá xay socola đậm đà", null, 2),
                new Product(daxayCategory.Id, "Đá Xay Oreo", 28000, "Đá xay Oreo thơm ngon", null, 3),
                new Product(daxayCategory.Id, "Đá Xay Dâu", 28000, "Đá xay dâu tươi mát", null, 4)
            };

            foreach (var product in daxayProducts)
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var sizes = new[]
                {
                    new ProductSize(product.Id, "M", 0, true),
                    new ProductSize(product.Id, "L", 7000, false)
                };
                await context.ProductSizes.AddRangeAsync(sizes);
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedOKEVouchersAsync(ApplicationDbContext context)
        {
            if (await context.Vouchers.AnyAsync())
                return;

            var vouchers = new List<Voucher>();

            var welcome = new Voucher(
                code: "OKE5K",
                name: "OKE - Giảm 5K",
                discountType: DiscountType.FixedAmount,
                discountValue: 5000,
                startDate: new DateTime(2026, 1, 1),
                endDate: new DateTime(2026, 12, 31),
                description: "Giảm 5K cho đơn hàng từ 30K",
                minOrderAmount: 30000,
                maxDiscountAmount: null,
                usageLimit: 500
            );
            vouchers.Add(welcome);

            var combo = new Voucher(
                code: "OKECOMBO",
                name: "OKE Combo - Giảm 10K",
                discountType: DiscountType.FixedAmount,
                discountValue: 10000,
                startDate: new DateTime(2026, 1, 1),
                endDate: new DateTime(2026, 12, 31),
                description: "Giảm 10K khi mua từ 2 ly",
                minOrderAmount: 50000,
                maxDiscountAmount: null,
                usageLimit: 300
            );
            vouchers.Add(combo);

            await context.Vouchers.AddRangeAsync(vouchers);
            await context.SaveChangesAsync();
        }
    }
}
