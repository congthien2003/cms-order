using Application.Models.Role;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.User.Response
{
    public class UserDetailResponse
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsEmailConfirmed { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? IsPhoneNumberConfirmed { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public List<RoleInfoResponse> Roles { get; set; } = new();
        public string? ProfilePictureUrl { get; set; }
        public bool IsActive { get; set; }
    }
}
