using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Application.Interfaces;
using StockManager.Application.Services;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Context;
using StockManager.Infrastructure.Identity;
using StockManager.Infrastructure.Repositories;

namespace StockManager.CrossCutting.IoC;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<StockManagerDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(StockManagerDbContext).Assembly.FullName)));

        // Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductBatchRepository, ProductBatchRepository>();
        services.AddScoped<IStockMovementRepository, StockMovementRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        // Identity / PasswordHasher
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        return services;
    }

    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // MediatR Configuration
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
            cfg.RegisterServicesFromAssembly(typeof(StockManager.Application.Common.Result).Assembly);
            cfg.AddOpenBehavior(typeof(StockManager.Application.Common.Behaviors.ValidationBehavior<,>));
        });

        // Services
        services.AddScoped<ITokenService, TokenService>();

        return services;
    }
}
