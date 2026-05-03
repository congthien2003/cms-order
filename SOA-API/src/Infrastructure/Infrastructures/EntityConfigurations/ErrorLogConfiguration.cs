using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructures.EntityConfigurations
{
    public class ErrorLogConfiguration : IEntityTypeConfiguration<ErrorLog>
    {
        public void Configure(EntityTypeBuilder<ErrorLog> builder)
        {
            builder.ToTable("ErrorLogs");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Level).HasMaxLength(32).IsRequired();
            builder.Property(e => e.Message).HasMaxLength(2000).IsRequired();
            builder.Property(e => e.MessageKey).HasMaxLength(256);
            builder.Property(e => e.ExceptionType).HasMaxLength(512);
            builder.Property(e => e.TraceId).HasMaxLength(128);
            builder.Property(e => e.LoggingEvent).HasMaxLength(128);
            builder.Property(e => e.MemberName).HasMaxLength(256);
            builder.Property(e => e.RequestMethod).HasMaxLength(16);
            builder.Property(e => e.RequestPath).HasMaxLength(1024);
            builder.Property(e => e.QueryString).HasMaxLength(2048);
            builder.Property(e => e.UserId).HasMaxLength(128);
            builder.Property(e => e.UserName).HasMaxLength(256);
            builder.Property(e => e.Source).HasMaxLength(256);

            builder.HasIndex(e => e.OccurredAtUtc);
            builder.HasIndex(e => e.TraceId);
            builder.HasIndex(e => e.StatusCode);
            builder.HasIndex(e => e.RequestPath);
            builder.HasIndex(e => e.UserId);
        }
    }
}
