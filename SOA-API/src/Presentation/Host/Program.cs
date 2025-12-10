using Application;
using Host.Extensions;
using Infrastructures;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Host;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddIntegrations();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.EssentialConfig(builder.Configuration);
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Store Order App - API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseExceptionHandler(opt =>{});

app.UseLoggerMiddlewareExtensions();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

try
{
    Log.Information("Starting web host");

    if(app.Environment.IsDevelopment())
    {
        Log.Information("Running in Development environment");
    }
    else
    {
        Log.Information("Running in Production environment");
    }

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
