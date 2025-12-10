using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Interfaces.Infrastructure.Excel
{
    public interface IExcelService
    {
        Task<byte[]> GenerateExcelAsync<T>(IEnumerable<T> data, string sheetName = "Sheet1", CancellationToken cancellationToken = default);
    }
}
