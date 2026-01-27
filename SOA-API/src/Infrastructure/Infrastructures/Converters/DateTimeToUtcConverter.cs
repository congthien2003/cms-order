using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructures.Converters;

/// <summary>
/// Converter to ensure all DateTime values are stored as UTC in PostgreSQL
/// </summary>
public class DateTimeToUtcConverter : ValueConverter<DateTime, DateTime>
{
    public DateTimeToUtcConverter()
        : base(
            v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc))
    {
    }
}

/// <summary>
/// Converter for nullable DateTime values
/// </summary>
public class NullableDateTimeToUtcConverter : ValueConverter<DateTime?, DateTime?>
{
    public NullableDateTimeToUtcConverter()
        : base(
            v => v.HasValue ? (v.Value.Kind == DateTimeKind.Utc ? v.Value : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)) : v,
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v)
    {
    }
}
