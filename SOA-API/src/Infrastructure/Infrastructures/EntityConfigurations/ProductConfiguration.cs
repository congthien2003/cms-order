using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for Product
    /// </summary>
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Description)
                .HasMaxLength(1000);

            builder.Property(e => e.ImageUrl)
                .HasMaxLength(500);

            builder.Property(e => e.BasePrice)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

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
            builder.HasIndex(e => e.CategoryId);
            builder.HasIndex(e => e.IsActive);
            builder.HasIndex(e => e.SortOrder);
            builder.HasIndex(e => e.IsDeleted);

            // Relationships
            builder.HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(p => p.Sizes)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.ProductToppings)
                .WithOne(pt => pt.Product)
                .HasForeignKey(pt => pt.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
