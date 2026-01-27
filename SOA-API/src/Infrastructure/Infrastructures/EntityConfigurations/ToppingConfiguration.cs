using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for Topping
    /// </summary>
    public class ToppingConfiguration : IEntityTypeConfiguration<Topping>
    {
        public void Configure(EntityTypeBuilder<Topping> builder)
        {
            builder.ToTable("Toppings");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Price)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(e => e.ImageUrl)
                .HasMaxLength(500);

            builder.Property(e => e.IsActive)
                .HasDefaultValue(true);

            builder.Property(e => e.SortOrder)
                .HasDefaultValue(0);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);

            // Indexes
            builder.HasIndex(e => e.Name);
            builder.HasIndex(e => e.IsActive);
            builder.HasIndex(e => e.SortOrder);

            // Relationships
            builder.HasMany(t => t.ProductToppings)
                .WithOne(pt => pt.Topping)
                .HasForeignKey(pt => pt.ToppingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
