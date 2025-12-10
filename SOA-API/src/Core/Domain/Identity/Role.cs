using Domain.Abstractions;

namespace Domain.Identity
{
    public class Role : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
        public Role()
        {
        }
        private Role(string name, string? description = null)
        {
            Name = name;
            Description = description;
        }

        /// <summary>
        /// Creates a new role with the specified name and optional description.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public static Role Create(string name, string? description = null)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Role name cannot be null or empty.", nameof(name));
            }
            return new Role(name, description);
        }


        /// <summary>
        /// Updates the role's name and optional description.
        /// <param name="name"></param>
        /// <param name="description"></param>   
        /// </summary>
        public void Update(string name, string? description = null)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Role name cannot be null or empty.", nameof(name));
            }
            Name = name;
            Description = description;
        }


    }
}
