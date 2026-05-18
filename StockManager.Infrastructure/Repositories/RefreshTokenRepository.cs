using Microsoft.EntityFrameworkCore;
using StockManager.Domain.Entities;
using StockManager.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Context;

namespace StockManager.Infrastructure.Repositories;

public class RefreshTokenRepository : BaseRepository<RefreshToken>, IRefreshTokenRepository
{
    public RefreshTokenRepository(StockManagerDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return await DbSet.Include(x => x.User).FirstOrDefaultAsync(x => x.Token == token, cancellationToken);
    }
}
