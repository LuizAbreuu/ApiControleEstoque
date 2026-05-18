using Microsoft.Extensions.Configuration;
using StockManager.Application.DTOs.Auth;
using StockManager.Application.Interfaces;
using StockManager.Domain.Entities;
using StockManager.Domain.Exceptions;
using StockManager.Domain.Interfaces;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new BusinessException("E-mail ou senha inválidos.");
        }

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);

        if (refreshToken == null || refreshToken.IsExpired)
        {
            throw new BusinessException("Refresh Token inválido ou expirado.");
        }

        var user = refreshToken.User;
        if (user == null || !user.Active)
        {
            throw new BusinessException("Usuário inválido ou inativo.");
        }

        // Revogar token atual (deleta ou marca como inativo)
        _refreshTokenRepository.Delete(refreshToken);

        return await GenerateAuthResponseAsync(user);
    }

    private async Task<AuthResponseDto> GenerateAuthResponseAsync(User user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshTokenStr = _tokenService.GenerateRefreshToken();
        var expiresInMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");
        var refreshTokenExpirationDays = int.Parse(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7");

        var refreshToken = new RefreshToken
        {
            Token = refreshTokenStr,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
        };

        await _refreshTokenRepository.AddAsync(refreshToken);
        await _unitOfWork.CommitAsync();

        return new AuthResponseDto
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
    }
}
