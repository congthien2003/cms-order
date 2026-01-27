using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for OrderItemTopping
    /// </summary>
    public class OrderItemToppingConfiguration : IEntityTypeConfiguration<OrderItemTopping>
    {
        public void Configure(EntityTypeBuilder<OrderItemTopping> builder)
        {
            builder.ToTable("OrderItemToppings");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.ToppingName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Price)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(e => e.Quantity)
                .IsRequired()
                .HasDefaultValue(1);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);

            // Indexes
            builder.HasIndex(e => e.OrderItemId);
            builder.HasIndex(e => e.ToppingId);

            // Relationships
            builder.HasOne(t => t.OrderItem)
                .WithMany(i => i.Toppings)
                .HasForeignKey(t => t.OrderItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Topping>()
                .WithMany()
                .HasForeignKey(t => t.ToppingId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
