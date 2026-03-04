using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Host.Extensions
{
    public static class AuthenticationExtension
    {
        public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings");

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Support SignalR access token via query string for WebSocket/SSE
                        var path = context.HttpContext.Request.Path;
                        var accessToken = context.Request.Query["access_token"].FirstOrDefault();

                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/orders"))
                        {
                            context.Token = accessToken;
                            return Task.CompletedTask;
                        }

                        // Fallback: Authorization header
                        var headerToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                        if (!string.IsNullOrEmpty(headerToken))
                        {
                            context.Token = headerToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });
        }
    }
}
