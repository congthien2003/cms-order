using Domain.Abstractions;
using Domain.Entities;
using Domain.Identity;
using Application.Services.Interfaces.Authentication;
using Infrastructures.Converters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures
{
    /// <summary>
    /// Application database context for Entity Framework Core.
    /// Manages all database entities and their configurations.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private bool disableAudit = false;

        /// <summary>
        /// Initializes a new instance of the ApplicationDbContext class.
        /// </summary>
        /// <param name="options">The database context options</param>
        /// <param name="currentUserService">Service for accessing current user information</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService currentUserService) : base(options)
        {
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Disables audit trail recording for the next save operation.
        /// </summary>
        public void DisableAudit()
        {
            disableAudit = true;
        }

        /// <summary>
        /// Configures the database model and entity relationships.
        /// </summary>
        /// <param name="modelBuilder">The model builder for configuring entities</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply all entity configurations from assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            // Configure DateTime to always use UTC for PostgreSQL
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(new DateTimeToUtcConverter());
                    }
                    else if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(new NullableDateTimeToUtcConverter());
                    }
                }
            }

            // Many-to-many config for User-Role relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserRoles", // join table name
                    j => j.HasOne<Role>()
                          .WithMany()
                          .HasForeignKey("RoleId")
                          .HasConstraintName("FK_UserRoles_Roles_RoleId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<User>()
                          .WithMany()
                          .HasForeignKey("UserId")
                          .HasConstraintName("FK_UserRoles_Users_UserId")
                          .OnDelete(DeleteBehavior.Cascade)
                );
        }

        /// <summary>
        /// Gets or sets the Users database set.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Gets or sets the Roles database set.
        /// </summary>
        public DbSet<Role> Roles { get; set; }

        /// <summary>
        /// Gets or sets the Categories database set.
        /// </summary>
        public DbSet<Category> Category { get; set; }

        /// <summary>
        /// Gets or sets the Products database set.
        /// </summary>
        public DbSet<Product> Products { get; set; }

        /// <summary>
        /// Gets or sets the ProductSizes database set.
        /// </summary>
        public DbSet<ProductSize> ProductSizes { get; set; }

        /// <summary>
        /// Gets or sets the Toppings database set.
        /// </summary>
        public DbSet<Topping> Toppings { get; set; }

        /// <summary>
        /// Gets or sets the ProductToppings database set.
        /// </summary>
        public DbSet<ProductTopping> ProductToppings { get; set; }

        /// <summary>
        /// Gets or sets the Vouchers database set.
        /// </summary>
        public DbSet<Voucher> Vouchers { get; set; }

        /// <summary>
        /// Gets or sets the Orders database set.
        /// </summary>
        public DbSet<Order> Orders { get; set; }

        /// <summary>
        /// Gets or sets the OrderItems database set.
        /// </summary>
        public DbSet<OrderItem> OrderItems { get; set; }

        /// <summary>
        /// Gets or sets the OrderItemToppings database set.
        /// </summary>
        public DbSet<OrderItemTopping> OrderItemToppings { get; set; }

        /// <summary>
        /// Gets or sets the ShopSettings database set.
        /// </summary>
        public DbSet<ShopSetting> ShopSettings { get; set; }

        /// <summary>
        /// Gets or sets the ErrorLogs database set.
        /// </summary>
        public DbSet<ErrorLog> ErrorLogs { get; set; }


        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            if (disableAudit)
            {
                return await base.SaveChangesAsync(cancellationToken);
            }

            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.CreatedById ??= _currentUserService.CurrentUser.Id.ToString();
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedById = _currentUserService.CurrentUser.Id.ToString();
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
