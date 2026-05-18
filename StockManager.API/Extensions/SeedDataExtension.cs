using StockManager.Domain.Entities;
using StockManager.Domain.Enums;
using StockManager.Domain.Interfaces;
using StockManager.Application.Interfaces;
using StockManager.Infrastructure.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace StockManager.API.Extensions;

public static class SeedDataExtension
{
    public static async Task SeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<StockManagerDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        // Garante que as migrations sejam aplicadas e o banco exista
        await context.Database.EnsureCreatedAsync();

        // Seeding do Usuário Admin inicial
        if (!context.Users.Any())
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Name = "Administrador do Sistema",
                Email = "admin@stockmanager.com",
                PasswordHash = passwordHasher.Hash("Admin@123"),
                Role = UserRole.Admin,
                Active = true,
                CreatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(adminUser);
            
            // Categoria genérica para teste
            var cat = new Category 
            { 
                Id = Guid.NewGuid(), 
                Name = "Geral", 
                Active = true, 
                CreatedAt = DateTime.UtcNow 
            };
            
            await context.Categories.AddAsync(cat);

            await context.SaveChangesAsync();
        }
    }
}
