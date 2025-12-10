using Application.Services.Interfaces.Authentication;
using Application.Services.Interfaces.Infrastructure.Cache;
using Application.Services.Interfaces.Infrastructure.Cloud;
using Application.Services.Interfaces.Infrastructure.ImageOpimization;
using Domain.Repositories;
using Infrastructures.Authentication;
using Infrastructures.Repositories;
using Infrastructures.Services.Cache.MemoryCache;
using Infrastructures.Services.ImageOptimization;
using Integrations.AzureBlob;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructures
{
    public static class DependencyInjection
    {   public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<ApplicationDbContext>(opts =>
            {
                opts.UseSqlServer(config.GetConnectionString("sqlConnection"));
                opts.UseLoggerFactory(LoggerFactory.Create(builder => { }))
                       .EnableSensitiveDataLogging(false)
                       .EnableDetailedErrors(true);
            });

            services.AddScoped<IImageOptimizationService, ImageOptimizationService>();
            services.AddScoped<ICloudService, AzureBlobService>();

            services.AddInMemoryCacheService();

            services.AddScoped<IJwtManager, JwtManager>();
            services.AddScoped<IRepositoryManager, RepositoryManager>();

            return services;
        }

        public static IServiceCollection AddInMemoryCacheService(this IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddScoped<IMemoryCacheService, MemoryCacheService>();
            return services;
        }
    }
}
