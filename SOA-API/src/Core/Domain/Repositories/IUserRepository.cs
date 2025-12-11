using Domain.Identity;

namespace Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<User?> GetUserByEmailAsync(string email);
    }
}
