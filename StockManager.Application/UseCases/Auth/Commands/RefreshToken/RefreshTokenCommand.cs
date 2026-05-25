using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Auth;

namespace StockManager.Application.UseCases.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(string RefreshToken) : IRequest<Result<AuthResponseDto>>;
