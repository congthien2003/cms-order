using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    /// <summary>
    /// Entity configuration for ShopSetting (Singleton pattern)
    /// </summary>
    public class ShopSettingConfiguration : IEntityTypeConfiguration<ShopSetting>
    {
        public void Configure(EntityTypeBuilder<ShopSetting> builder)
        {
            builder.ToTable("ShopSettings");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.ShopName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Address)
                .HasMaxLength(500);

            builder.Property(e => e.Phone)
                .HasMaxLength(20);

            builder.Property(e => e.Email)
                .HasMaxLength(100);

            builder.Property(e => e.Logo)
                .HasMaxLength(500);

            builder.Property(e => e.DefaultVATPercentage)
                .HasColumnType("decimal(5,2)")
                .HasDefaultValue(10);

            builder.Property(e => e.IsVATEnabled)
                .HasDefaultValue(true);

            builder.Property(e => e.ReceiptFooter)
                .HasMaxLength(1000);

            builder.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Global query filter
            builder.HasQueryFilter(e => !e.IsDeleted);
        }
    }
}
