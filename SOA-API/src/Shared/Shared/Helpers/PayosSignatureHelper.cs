using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace Shared.Helpers
{
    /// <summary>
    /// Helper class để xác thực chữ ký (signature) từ PayOS webhook
    /// Sử dụng thuật toán HMAC-SHA256 theo tài liệu PayOS
    /// </summary>
    public static class PayosSignatureHelper
    {
        /// <summary>
        /// Xác thực tính hợp lệ của dữ liệu webhook dựa trên signature
        /// </summary>
        /// <param name="data">Dữ liệu cần xác thực (thường là PayosWebhookData)</param>
        /// <param name="currentSignature">Signature nhận được từ PayOS</param>
        /// <param name="checksumKey">Secret key để tạo signature</param>
        /// <returns>True nếu signature hợp lệ, False nếu không</returns>
        public static bool IsValidData(Dictionary<string, object> data, string currentSignature, string checksumKey)
        {
            // 1. Sắp xếp dữ liệu theo thứ tự alphabet của key
            var sortedData = SortObjectByKey(data);
            
            // 2. Chuyển đổi thành query string format: key1=value1&key2=value2
            var queryString = ConvertObjToQueryStr(sortedData);
            
            // 3. Tạo signature từ query string bằng HMAC-SHA256
            var calculatedSignature = GenerateHmacSHA256(queryString, checksumKey);

            // 4. So sánh signature tính được với signature nhận được
            return string.Equals(calculatedSignature, currentSignature, StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Sắp xếp dictionary theo thứ tự alphabet của key
        /// </summary>
        /// <param name="dict">Dictionary cần sắp xếp</param>
        /// <returns>Dictionary đã được sắp xếp</returns>
        private static Dictionary<string, object> SortObjectByKey(Dictionary<string, object> dict)
        {
            return dict.OrderBy(kvp => kvp.Key)
                       .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
        }

        /// <summary>
        /// Chuyển đổi dictionary thành query string format
        /// Logic match với JavaScript mẫu từ tài liệu PayOS
        /// </summary>
        /// <param name="dict">Dictionary cần chuyển đổi</param>
        /// <returns>Query string format: key1=value1&key2=value2</returns>
        private static string ConvertObjToQueryStr(Dictionary<string, object> dict)
        {
            return string.Join("&", dict
                // Lọc bỏ các giá trị null, undefined
                .Where(kvp => kvp.Value != null && kvp.Value.ToString() != "undefined" && kvp.Value.ToString() != "null")
                .Select(kvp =>
                {
                    var value = kvp.Value;
                    
                    // Xử lý nested objects và arrays
                    if (value != null && value.GetType().IsClass && value.GetType() != typeof(string))
                    {
                        if (value is System.Collections.IEnumerable enumerable && !(value is string))
                        {
                            // Xử lý arrays: serialize thành JSON
                            var list = new List<object>();
                            foreach (var item in enumerable)
                            {
                                if (item is Dictionary<string, object> itemDict)
                                {
                                    list.Add(SortObjectByKey(itemDict));
                                }
                                else
                                {
                                    list.Add(item);
                                }
                            }
                            value = JsonConvert.SerializeObject(list);
                        }
                        else
                        {
                            // Xử lý nested objects: serialize thành JSON
                            var nestedDict = ToDictionary(value);
                            value = JsonConvert.SerializeObject(SortObjectByKey(nestedDict));
                        }
                    }
                    
                    // Set empty string cho null/undefined values
                    if (value == null || value.ToString() == "undefined" || value.ToString() == "null")
                    {
                        value = "";
                    }

                    // Format: key=value (camelCase cho key như JS mẫu)
                    var camelCaseKey = kvp.Key[0].ToString().ToLower() + kvp.Key.Substring(1);
                    return $"{camelCaseKey}={value}";
                }));
        }

        /// <summary>
        /// Tạo HMAC-SHA256 signature từ data và secret key
        /// </summary>
        /// <param name="data">Dữ liệu cần tạo signature</param>
        /// <param name="key">Secret key</param>
        /// <returns>Signature dạng hex string</returns>
        private static string GenerateHmacSHA256(string data, string key)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }

        /// <summary>
        /// Chuyển đổi object thành Dictionary<string, object>
        /// Sử dụng JSON serialization để handle complex objects
        /// </summary>
        /// <param name="data">Object cần chuyển đổi</param>
        /// <returns>Dictionary representation của object</returns>
        public static Dictionary<string, object> ToDictionary(object data)
        {
            var json = JsonConvert.SerializeObject(data);
            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
            return dict ?? new Dictionary<string, object>();
        }
    }
} 