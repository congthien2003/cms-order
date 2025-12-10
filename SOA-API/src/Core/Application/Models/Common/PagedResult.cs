using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Common
{
    public class PagedResult<T>
    {
        public IReadOnlyList<T> Items { get; init; }
        public int TotalCount { get; init; }
        public int PageNumber { get; init; }
        public int PageSize { get; init; }
        public int TotalPages { get; init; }

        public PagedResult(IReadOnlyList<T> items, int totalCount, int pageNumber, int pageSize, int totalPages )
        {
            Items = items;
            TotalCount = totalCount;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = totalPages;
        }
    }
}
