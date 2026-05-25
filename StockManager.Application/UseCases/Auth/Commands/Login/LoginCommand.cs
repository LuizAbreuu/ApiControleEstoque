using MediatR;
using StockManager.Application.Common;
using StockManager.Application.DTOs.Auth;

namespace StockManager.Application.UseCases.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponseDto>>;
