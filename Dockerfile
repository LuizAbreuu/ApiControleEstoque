# Use a imagem base do ASP.NET Core
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# Use a imagem do SDK para build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copia os arquivos de projeto para restaurar as dependências
COPY ["StockManager.API/StockManager.API.csproj", "StockManager.API/"]
COPY ["StockManager.Application/StockManager.Application.csproj", "StockManager.Application/"]
COPY ["StockManager.Domain/StockManager.Domain.csproj", "StockManager.Domain/"]
COPY ["StockManager.Infrastructure/StockManager.Infrastructure.csproj", "StockManager.Infrastructure/"]
COPY ["StockManager.CrossCutting/StockManager.CrossCutting.csproj", "StockManager.CrossCutting/"]

# Restaura as dependências
RUN dotnet restore "./StockManager.API/StockManager.API.csproj"

# Copia o restante do código
COPY . .
WORKDIR "/src/StockManager.API"

# Faz o build
RUN dotnet build "./StockManager.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Faz a publicação
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StockManager.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Gera a imagem final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StockManager.API.dll"]
