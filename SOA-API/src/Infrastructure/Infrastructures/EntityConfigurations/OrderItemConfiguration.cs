using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for OrderItem
    /// </summary>
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("OrderItems");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.ProductName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.SizeName)
                .HasMaxLength(50);

            builder.Property(e => e.Quantity)
                .IsRequired()
                .HasDefaultValue(1);

            builder.Property(e => e.UnitPrice)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(e => e.ToppingTotal)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.ItemTotal)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(e => e.Note)
                .HasMaxLength(500);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);

            // Indexes
            builder.HasIndex(e => e.OrderId);
            builder.HasIndex(e => e.ProductId);

            // Relationships
            builder.HasOne(i => i.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Product>()
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<ProductSize>()
                .WithMany()
                .HasForeignKey(i => i.ProductSizeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(i => i.Toppings)
                .WithOne(t => t.OrderItem)
                .HasForeignKey(t => t.OrderItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
