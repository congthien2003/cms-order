namespace Domain.Repositories
{
    public interface IRepositoryManager
    {
        IUserRepository UserRepository { get; }
        IRoleRepository RoleRepository { get; }
        Task DisposeAsync();
        Task SaveAsync(CancellationToken cancellationToken = default);
        Task SaveAsync(bool isAudit = false, CancellationToken cancellationToken = default);
    }

}
