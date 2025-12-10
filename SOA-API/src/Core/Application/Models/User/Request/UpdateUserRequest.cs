using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.User.Request
{
    public class UpdateUserRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public bool? IsPhoneNumberConfirmed { get; set; }
        public List<Guid> RoleIds { get; set; } = new List<Guid>();
    }
}
