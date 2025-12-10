namespace Application.Models.Common
{
    public class GetListParameters
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; } = string.Empty;
        public string? SortBy { get; set; } = null;
        public bool SortDescending { get; set; } = false;
        public bool? IsActive { get; set; } = null;
    }
}
