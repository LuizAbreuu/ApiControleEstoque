using MediatR;
using Microsoft.Extensions.Configuration;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Auth;
using StockManager.Application.Interfaces;
using StockManager.Domain.Entities;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.UseCases.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<AuthResponseDto>>
{
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public RefreshTokenCommandHandler(
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IConfiguration configuration)
    {
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    public async Task<Result<AuthResponseDto>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);

        if (refreshToken == null || refreshToken.IsExpired)
        {
            return Result<AuthResponseDto>.Failure("Refresh Token inválido ou expirado.", "UNAUTHORIZED");
        }

        var user = refreshToken.User;
        if (user == null || !user.Active)
        {
            return Result<AuthResponseDto>.Failure("Usuário inválido ou inativo.", "UNAUTHORIZED");
        }

        // Revogar token atual (deleta ou marca como inativo)
        _refreshTokenRepository.Delete(refreshToken);

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshTokenStr = _tokenService.GenerateRefreshToken();
        var expiresInMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");
        var refreshTokenExpirationDays = int.Parse(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7");

        var newRefreshToken = new StockManager.Domain.Entities.RefreshToken
        {
            Token = refreshTokenStr,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken);
        await _unitOfWork.CommitAsync();

        var response = new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenStr,
            ExpiresIn = expiresInMinutes * 60,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        };

        return Result<AuthResponseDto>.Success(response);
    }
}
