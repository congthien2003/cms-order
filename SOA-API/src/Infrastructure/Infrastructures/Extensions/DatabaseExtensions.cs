using Infrastructures.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructures.Extensions
{
    /// <summary>
    /// Extension methods for database initialization
    /// </summary>
    public static class DatabaseExtensions
    {
        /// <summary>
        /// Initializes the database with migrations and seed data
        /// </summary>
        public static async Task InitializeDatabaseAsync(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            await DbInitializer.SeedAsync(context);
        }
    }
}
