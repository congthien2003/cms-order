using Microsoft.AspNetCore.RateLimiting;
using Serilog;
using Asp.Versioning;
using Application.Commons.MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace Host.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection EssentialConfig(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            ConfigureLog(configuration);
            services.AddEndpointsApiExplorer();
            services.AddHttpContextAccessor();
            services.ConfigureJWT(configuration);
            services.ConfigureCors();
            services.ConfigureIISIntegration();
            // services.ConfigureSwagger();
            services.ConfigureRateLimiting(configuration);
            services.ConfigureApiVersioning();
            services.ConfigMediatR();

            return services;
        }
        public static IServiceCollection ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
               {
                   options.AddPolicy("CorsPolicy", builder =>
                   builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyOrigin()
                          //.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:5173/")
                          //.AllowCredentials()
                          .AllowAnyHeader());
               });
            return services;
        }
        public static void ConfigureIISIntegration(this IServiceCollection services) =>
            services.Configure<IISOptions>(options =>
            {
            });

        public static void ConfigureLog(IConfiguration configuration)
        {
            // Cấu hình Serilog
            Log.Logger = new LoggerConfiguration()
                        .ReadFrom.Configuration(configuration)
                        .Enrich.FromLogContext()
                        .CreateLogger();
        }

        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddOpenApi(options =>
            {
                options.AddDocumentTransformer((document, context, cancellationToken) =>
                {
                    document.Info = new OpenApiInfo
                    {
                        Title = "Store Order App - API",
                        Version = "v1",
                        Description = "API by Sabo"
                    };
                    return Task.CompletedTask;
                });

                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });
        }

        internal sealed class BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider) : IOpenApiDocumentTransformer
        {
            public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
            {
                var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
                if (authenticationSchemes.Any(authScheme => authScheme.Name == JwtBearerDefaults.AuthenticationScheme))
                {
                    var securityScheme = new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.Http,
                        Scheme = JwtBearerDefaults.AuthenticationScheme,
                        In = ParameterLocation.Header,
                        BearerFormat = "JWT",
                        Description = "JWT Authorization header using the Bearer scheme. Enter your token in the text input below."
                    };

                    document.Components ??= new OpenApiComponents();
                    document.Components.SecuritySchemes[JwtBearerDefaults.AuthenticationScheme] = securityScheme;

                    var schemeReference = new OpenApiSecuritySchemeReference(JwtBearerDefaults.AuthenticationScheme, document);

                    foreach (var operation in document.Paths.Values.SelectMany(path => path.Operations))
                    {
                        operation.Value.Security ??= [];
                        operation.Value.Security.Add(new OpenApiSecurityRequirement
                        {
                            [schemeReference] = new List<string>()
                        });
                    }
                }
            }
        }

        public static void ConfigureRateLimiting(this IServiceCollection services, IConfiguration configuration)
        {
            // Cấu hình Rate Limiting
            services.AddRateLimiter(options =>
            {
                options.AddFixedWindowLimiter("fixed", builder =>
                {
                    builder.PermitLimit = 100; // Số lượng yêu cầu tối đa trong khoảng thời gian
                    builder.Window = TimeSpan.FromMinutes(1); // Khoảng thời gian
                });
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            });
        }

        public static void ConfigureApiVersioning(this IServiceCollection services)
        {
            services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
            })
            .AddMvc()
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });
        }

        public static void ConfigMediatR(this IServiceCollection services)
        { 
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(ApplicationAssemblyMarker).Assembly);
            });
        }

    }
}
