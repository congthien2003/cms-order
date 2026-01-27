using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructures.Repositories
{
    public class ShopSettingRepository : RepositoryBase<ShopSetting>, IShopSettingRepository
    {
        public ShopSettingRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<ShopSetting?> GetSettingsAsync(bool trackChanges, CancellationToken cancellationToken)
        {
            var query = _context.Set<ShopSetting>().AsQueryable();

            if (!trackChanges)
                query = query.AsNoTracking();

            return await query.FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(CancellationToken cancellationToken)
        {
            return await _context.Set<ShopSetting>().AnyAsync(cancellationToken);
        }
    }
}
