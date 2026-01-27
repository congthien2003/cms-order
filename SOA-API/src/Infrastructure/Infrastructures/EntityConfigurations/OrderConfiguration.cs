using Domain.Entities;
using Domain.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for Order
    /// </summary>
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.OrderNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.CustomerName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.CustomerPhone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(e => e.SubTotal)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.DiscountAmount)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.VATAmount)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.VATPercentage)
                .HasColumnType("decimal(5,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.IsVATIncluded)
                .HasDefaultValue(true);

            builder.Property(e => e.TotalAmount)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.VoucherCode)
                .HasMaxLength(50);

            builder.Property(e => e.Status)
                .IsRequired()
                .HasConversion<int>()
                .HasDefaultValue(OrderStatus.Pending);

            builder.Property(e => e.PaymentMethod)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(e => e.PaymentStatus)
                .IsRequired()
                .HasConversion<int>()
                .HasDefaultValue(PaymentStatus.Pending);

            builder.Property(e => e.Note)
                .HasMaxLength(500);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);

            // Indexes
            builder.HasIndex(e => e.OrderNumber)
                .IsUnique();
            builder.HasIndex(e => e.Status);
            builder.HasIndex(e => e.PaymentStatus);
            builder.HasIndex(e => e.CreatedAt);
            builder.HasIndex(e => e.CustomerPhone);

            // Relationships
            builder.HasOne(o => o.Voucher)
                .WithMany()
                .HasForeignKey(o => o.VoucherId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
