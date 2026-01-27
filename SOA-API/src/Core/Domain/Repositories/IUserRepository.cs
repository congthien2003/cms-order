using Domain.Identity;

namespace Domain.Repositories
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        public Task<User?> GetUserByEmailAsync(string email);
    }
}
