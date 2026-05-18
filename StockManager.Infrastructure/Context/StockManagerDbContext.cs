using Microsoft.EntityFrameworkCore;
using StockManager.Domain.Entities;
using System.Reflection;

namespace StockManager.Infrastructure.Context;

public class StockManagerDbContext : DbContext
{
    public StockManagerDbContext(DbContextOptions<StockManagerDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<ProductBatch> ProductBatches { get; set; } = null!;
    public DbSet<StockMovement> StockMovements { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        
        // Global Query Filters para Soft Delete
        modelBuilder.Entity<User>().HasQueryFilter(x => x.Active);
        modelBuilder.Entity<Category>().HasQueryFilter(x => x.Active);
        modelBuilder.Entity<Product>().HasQueryFilter(x => x.Active);
        modelBuilder.Entity<ProductBatch>().HasQueryFilter(x => x.Active);
        modelBuilder.Entity<StockMovement>().HasQueryFilter(x => x.Active);
        modelBuilder.Entity<RefreshToken>().HasQueryFilter(x => x.Active);

        base.OnModelCreating(modelBuilder);
    }
}
