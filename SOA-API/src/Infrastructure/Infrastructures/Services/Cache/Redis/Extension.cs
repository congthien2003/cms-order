using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;

namespace Infrastructures.Services.Cache.Redis
{
    public static class Extension
    {
        public static IHostApplicationBuilder AddRedisCache(this IHostApplicationBuilder builder)
        {
            builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(builder.Configuration.GetSection("Redis:ConnectionString").Value!));

            builder.Services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = builder.Configuration.GetSection("Redis:ConnectionString").Value;
            });

            return builder;
        }
    }
}
