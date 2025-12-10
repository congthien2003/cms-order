using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Interfaces.Infrastructure.Cache
{
    public interface ICacheService
    {
        T? Get<T>(string key);
        void Remove(string key);
    }
}
