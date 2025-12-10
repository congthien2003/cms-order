using Domain.Abstractions;
namespace Domain.Identity
{
    public class User : BaseEntity, IActiveEntity
    {
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Salting { get; set; } = string.Empty; // Used for password hashing
        public bool IsEmailConfirmed { get; set; } = false;
        public string? PhoneNumber { get; set; } = string.Empty;
        public bool? IsPhoneNumberConfirmed { get; set; } = false;
        public DateTime? LastLoginAt { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Role> Roles { get; set; } = new List<Role>();

        // Additional properties can be added as needed

        public User()
        {
        }

        public User(string userName, string fullName, string email, string passwordHash, string salting, bool isEmailConfirmed, string? phoneNumber, bool? isPhoneNumberConfirmed, DateTime? lastLoginAt, string? profilePictureUrl, bool isActive)
        {
            UserName = userName;
            FullName = fullName;
            Email = email;
            PasswordHash = passwordHash;
            Salting = salting;
            IsEmailConfirmed = isEmailConfirmed;
            PhoneNumber = phoneNumber;
            IsPhoneNumberConfirmed = isPhoneNumberConfirmed;
            LastLoginAt = lastLoginAt;
            ProfilePictureUrl = profilePictureUrl;
            IsActive = isActive;
        }

        //public static User Create(string userName, string fullName, string email, string passwordHash, string salting, bool isEmailConfirmed, string? phoneNumber, bool? isPhoneNumberConfirmed, DateTime? lastLoginAt, string? profilePictureUrl, bool isActive)
        //{
        //    if (string.IsNullOrWhiteSpace(request.UserName))
        //        throw new ArgumentException("User name cannot be empty.", nameof(request.UserName));
        //    if (string.IsNullOrWhiteSpace(request.Email))
        //        throw new ArgumentException("Email cannot be empty.", nameof(request.Email));
        //    if (string.IsNullOrWhiteSpace(passwordHash))
        //        throw new ArgumentException("Password hash cannot be empty.", nameof(passwordHash));
        //    if (!request.Email.Contains("@"))
        //        throw new ArgumentException("Email is not valid.", nameof(request.Email));
        //    if (request.PhoneNumber != null && request.PhoneNumber.Length < 10)
        //        throw new ArgumentException("Phone number must be at least 10 digits long.", nameof(request.PhoneNumber));
        //    if (request.ProfilePictureUrl != null && !Uri.IsWellFormedUriString(request.ProfilePictureUrl, UriKind.Absolute))
        //        throw new ArgumentException("Profile picture URL is not valid.", nameof(request.ProfilePictureUrl));

        //    return new User
        //    {
        //        UserName = request.UserName,
        //        FullName = request.FullName,
        //        Email = request.Email,
        //        PasswordHash = passwordHash,
        //        Salting = salting,
        //        PhoneNumber = request.PhoneNumber,
        //        ProfilePictureUrl = request.ProfilePictureUrl,
        //        IsEmailConfirmed = false,
        //        IsPhoneNumberConfirmed = false,
        //        IsActive = true,
        //        Roles = new List<Role>()
        //    };
        //}


        /// <summary>
        /// Add new role into list
        /// </summary>
        /// <param name="role"></param>
        public void AddRole(Role role)
        {
            Roles.Add(role);
        }

        /// <summary>
        /// Remove specific role in list
        /// </summary>
        /// <param name="role"></param>
        public void RemoveRole(Role role)
        {
            Roles.Remove(role);
        }

        /// <summary>
        /// DeActive User
        /// void
        /// </summary>
        public void SetActive(bool isActive)
        {
            this.IsActive = isActive;
        }
    }
}
