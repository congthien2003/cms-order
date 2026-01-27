using Domain.Entities;
using Domain.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for Voucher
    /// </summary>
    public class VoucherConfiguration : IEntityTypeConfiguration<Voucher>
    {
        public void Configure(EntityTypeBuilder<Voucher> builder)
        {
            builder.ToTable("Vouchers");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.DiscountType)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(e => e.DiscountValue)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(e => e.MinOrderAmount)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.MaxDiscountAmount)
                .HasColumnType("decimal(18,2)");

            builder.Property(e => e.StartDate)
                .IsRequired();

            builder.Property(e => e.EndDate)
                .IsRequired();

            builder.Property(e => e.UsageLimit)
                .HasDefaultValue(0);

            builder.Property(e => e.UsedCount)
                .HasDefaultValue(0);

            builder.Property(e => e.IsActive)
                .HasDefaultValue(true);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);

            // Indexes
            builder.HasIndex(e => e.Code)
                .IsUnique();
            builder.HasIndex(e => e.IsActive);
            builder.HasIndex(e => new { e.StartDate, e.EndDate });

            // Relationships
            builder.HasMany<Order>()
                .WithOne(o => o.Voucher)
                .HasForeignKey(o => o.VoucherId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
