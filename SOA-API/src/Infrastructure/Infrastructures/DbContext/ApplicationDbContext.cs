using Domain.Abstractions;
using Domain.Entities;
using Domain.Identity;
using Application.Services.Interfaces.Authentication;
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

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.DisplayOrder)
                    .HasDefaultValue(0);

                entity.Property(e => e.IsDeleted)
                    .HasDefaultValue(false);

                // Global query filter for soft delete
                entity.HasQueryFilter(e => !e.IsDeleted);

                // Index for name searches
                entity.HasIndex(e => e.Name)
                    .IsUnique(false)
                    .HasFilter("[IsDeleted] = 0");

                // Index for display order sorting
                entity.HasIndex(e => e.DisplayOrder);
            });

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
