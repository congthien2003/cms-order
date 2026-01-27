using Domain.Identity;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Set<User>()
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
