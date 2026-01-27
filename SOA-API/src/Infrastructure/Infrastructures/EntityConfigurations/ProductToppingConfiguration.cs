using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for ProductTopping (Many-to-Many)
    /// </summary>
    public class ProductToppingConfiguration : IEntityTypeConfiguration<ProductTopping>
    {
        public void Configure(EntityTypeBuilder<ProductTopping> builder)
        {
            builder.ToTable("ProductToppings");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.IsDefault)
                .HasDefaultValue(false);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);

            // Indexes
            builder.HasIndex(e => new { e.ProductId, e.ToppingId })
                .IsUnique();

            // Relationships
            builder.HasOne(pt => pt.Product)
                .WithMany(p => p.ProductToppings)
                .HasForeignKey(pt => pt.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pt => pt.Topping)
                .WithMany(t => t.ProductToppings)
                .HasForeignKey(pt => pt.ToppingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
