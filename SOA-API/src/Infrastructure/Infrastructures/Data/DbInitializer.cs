using Domain.Entities;
using Domain.Entities.Enums;
using Microsoft.EntityFrameworkCore;

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

            // Seed Shop Settings (Singleton)
            await SeedShopSettingsAsync(context);

            // Seed Categories
            await SeedCategoriesAsync(context);

            // Seed Toppings
            await SeedToppingsAsync(context);

            // Seed Products with Sizes
            await SeedProductsAsync(context);

            // Seed Sample Vouchers
            await SeedVouchersAsync(context);

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
    }
}
