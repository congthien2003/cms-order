namespace Application.Services.Interfaces.Infrastructure.Cache
{
    public interface IRedisService
    {
        T Get<T>(string key);
        Task Set<T>(string key, T value, int minutes = 10);
        void Remove(string key);
        Task ClearByPatternAsync(string pattern);
        Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken = default);
    }
}
