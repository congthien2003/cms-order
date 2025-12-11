using Domain.Repositories;
using Infrastructures.Repositories.Implementations;

namespace Infrastructures.Repositories
{
    /// <summary>
    /// Repository manager that provides access to all repository implementations.
    /// Implements the Unit of Work pattern for coordinating multiple repositories.
    /// </summary>
    public class RepositoryManager : IRepositoryManager
    {
        private readonly ApplicationDbContext _context;
        private Lazy<IUserRepository> _userRepository;
        private Lazy<IRoleRepository> _roleRepository;
        private Lazy<ICategoryRepository> _categoryRepository;

        /// <summary>
        /// Initializes a new instance of the RepositoryManager class.
        /// </summary>
        /// <param name="context">The application database context</param>
        public RepositoryManager(ApplicationDbContext context)
        {
            _context = context;
            _userRepository = new Lazy<IUserRepository>(() => new UserRepository(_context));
            _roleRepository = new Lazy<IRoleRepository>(() => new RoleRepository(_context));
            _categoryRepository = new Lazy<ICategoryRepository>(() => new CategoryRepository(_context));
        }

        /// <summary>
        /// Gets the user repository instance.
        /// </summary>
        public IUserRepository UserRepository => _userRepository.Value;

        /// <summary>
        /// Gets the role repository instance.
        /// </summary>
        public IRoleRepository RoleRepository => _roleRepository.Value;

        /// <summary>
        /// Gets the category repository instance.
        /// </summary>
        public ICategoryRepository CategoryRepository => _categoryRepository.Value;

        /// <summary>
        /// Disposes the database context and releases resources.
        /// </summary>
        public async Task DisposeAsync()
        {
            await _context.DisposeAsync();
        }

        /// <summary>
        /// Saves all changes made in the context to the database.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        public async Task SaveAsync(CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        /// <summary>
        /// Saves changes to the database with optional audit disabling.
        /// </summary>
        /// <param name="isAudit">Whether to include audit information</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        public async Task SaveAsync(bool isAudit = true, CancellationToken cancellationToken = default)
        {
            _context.DisableAudit();
            await _context.SaveChangesAsync(false, cancellationToken);
        }
    }
}

