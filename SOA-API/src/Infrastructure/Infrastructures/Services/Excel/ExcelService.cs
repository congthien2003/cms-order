using Application.Services.Interfaces.Infrastructure.Excel;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using System.ComponentModel;
using System.Reflection;

namespace Infrastructures.Services.Excel
{
    public class ExcelService : IExcelService
    {
        private readonly ILogger<ExcelService> _logger;

        public ExcelService(ILogger<ExcelService> logger)
        {
            _logger = logger;
        }

        public async Task<byte[]> GenerateExcelAsync<T>(IEnumerable<T> data, string sheetName = "Sheet1", CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Generating Excel file with sheet name: {SheetName}", sheetName);

            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add(sheetName);

            if (data == null || !data.Any())
            {
                _logger.LogWarning("No data provided for Excel generation");
                return package.GetAsByteArray();
            }

            var dataList = data.ToList();
            var type = typeof(T);
            var properties = GetExportableProperties(type);

            // Add headers
            for (int i = 0; i < properties.Count; i++)
            {
                var displayName = GetDisplayName(properties[i]);
                worksheet.Cells[1, i + 1].Value = displayName;
                worksheet.Cells[1, i + 1].Style.Font.Bold = true;
            }

            // Add data rows
            for (int row = 0; row < dataList.Count; row++)
            {
                var item = dataList[row];
                for (int col = 0; col < properties.Count; col++)
                {
                    var value = properties[col].GetValue(item);

                    // Handle decimal formatting for currency values
                    if (value is decimal decimalValue)
                    {
                        worksheet.Cells[row + 2, col + 1].Value = decimalValue;
                        worksheet.Cells[row + 2, col + 1].Style.Numberformat.Format = "#,##0.00";
                    }
                    else
                    {
                        worksheet.Cells[row + 2, col + 1].Value = value?.ToString() ?? string.Empty;
                    }
                }
            }

            // Auto-fit columns
            worksheet.Cells.AutoFitColumns();

            // Apply some basic styling
            using (var range = worksheet.Cells[1, 1, 1, properties.Count])
            {
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                range.Style.Font.Bold = true;
            }

            _logger.LogInformation("Generated Excel file with {Rows} rows and {Columns} columns", dataList.Count, properties.Count);

            return await Task.FromResult(package.GetAsByteArray());
        }

        private static List<PropertyInfo> GetExportableProperties(Type type)
        {
            return type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                      .Where(p => p.CanRead)
                      .ToList();
        }

        private static string GetDisplayName(PropertyInfo property)
        {
            var displayNameAttribute = property.GetCustomAttribute<DisplayNameAttribute>();
            return displayNameAttribute?.DisplayName ?? property.Name;
        }
    }
}
