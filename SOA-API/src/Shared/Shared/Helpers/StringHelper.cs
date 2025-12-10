using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Shared.Helpers
{
    public static class StringHelper
    {
        public static string RemoveSpecialCharacters(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            return Regex.Replace(input, @"[^a-zA-Z0-9\s]", "");
        }

        public static string RemoveDiacritics(string text)
        {
            var normalized = text.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();

            foreach (var c in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }

            return sb.ToString().Normalize(NormalizationForm.FormC);
        }

        public static string NormalizeAddress(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            // Bỏ dấu tiếng Việt
            string noDiacritics = RemoveDiacritics(input);

            // Bỏ ký tự đặc biệt, chuyển thường, chuẩn hóa khoảng trắng
            string normalized = Regex.Replace(noDiacritics, @"[^a-zA-Z0-9\s]", "")
                                     .ToLower()
                                     .Trim();
            normalized = Regex.Replace(normalized, @"\s+", " "); // bỏ khoảng trắng thừa

            return normalized;
        }
    }
}
