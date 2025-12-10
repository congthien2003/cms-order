using Domain.Repositories;
using Infrastructures.Repositories.Implementations;
namespace Infrastructures.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly ApplicationDbContext _context;
        public Lazy<IUserRepository> _userRepository;
        public Lazy<IRoleRepository> _roleRepository;

        public RepositoryManager(ApplicationDbContext context)
        {
            _context = context;
            _userRepository = new Lazy<IUserRepository>(() => new UserRepository(_context));
            _roleRepository = new Lazy<IRoleRepository>(() => new RoleRepository(_context));
        }

        public IUserRepository UserRepository => _userRepository.Value;
        public IRoleRepository RoleRepository => _roleRepository.Value;

        public async Task DisposeAsync()
        {
            await _context.DisposeAsync();
        }
        public async Task SaveAsync(CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task SaveAsync(bool isAudit = true, CancellationToken cancellationToken = default)
        {
            _context.DisableAudit();
           await _context.SaveChangesAsync(false, cancellationToken);
        }
    }
}
