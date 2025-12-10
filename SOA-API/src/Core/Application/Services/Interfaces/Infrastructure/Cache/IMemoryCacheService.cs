using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Interfaces.Infrastructure.Cache
{
    public interface IMemoryCacheService : ICacheService
    {
        void Set<T>(string key, T value, TimeSpan? expiration = null);

    }
}
