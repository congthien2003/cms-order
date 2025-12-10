using Domain.Abstractions;
using Domain.Identity;
using Application.Services.Interfaces.Authentication;
using Microsoft.EntityFrameworkCore;
namespace Infrastructures
{
    public class ApplicationDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private bool disableAudit = false;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService currentUserService) : base(options) {
            _currentUserService = currentUserService;
        }

        public void DisableAudit()
        {
            disableAudit = true;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-many config
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity<Dictionary<string, object>>( // dùng join table ẩn
                    "UserRoles", // tên bảng join
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

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

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
