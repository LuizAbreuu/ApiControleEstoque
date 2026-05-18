<h1 align="center">📦 StockManager API (Controle de Estoque)</h1>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white" alt=".NET 10.0" />
  <img src="https://img.shields.io/badge/C%23-13.0-239120?logo=csharp&logoColor=white" alt="C# 13.0" />
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoft-sql-server&logoColor=white" alt="SQL Server" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Clean_Architecture-Success" alt="Clean Architecture" />
</p>

## 🚀 Sobre o Projeto

O **StockManager API** é um sistema robusto de back-end desenvolvido para gerenciar operações de controle de estoque. Ele foi projetado focando em alta coesão, baixo acoplamento e adoção das melhores práticas de mercado (SOLID e Design Patterns), garantindo que as regras de negócios de inventário, como controle de entrada e saída (FIFO), sejam rigorosamente mantidas e validadas.

---

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), dividindo as responsabilidades em camadas bem definidas. Isso facilita a manutenção, permite a testabilidade automatizada contínua e desacopla as regras de negócio de frameworks e bancos de dados.

* **Domain (Domínio):** O coração da aplicação. Contém as Entidades, Interfaces de Repositório e Regras de Negócios fundamentais. Não possui dependências de outras camadas.
* **Application (Aplicação):** Orquestra os fluxos da aplicação (Casos de Uso/Services), mapeia DTOs e define contratos. Implementa as lógicas que utilizam as entidades de domínio.
* **Infrastructure (Infraestrutura):** Lida com o mundo exterior. Implementa o acesso a dados (Entity Framework Core), configurações de banco de dados e integrações externas.
* **CrossCutting (Transversal):** Camada de suporte utilizada por toda a aplicação. Geralmente abriga configurações de Injeção de Dependência, utilitários globais, autenticação e provedores de criptografia.
* **API (Apresentação):** A porta de entrada do sistema. Expõe os endpoints REST (Controllers), gerencia rotas, middlewares, e validações iniciais.

---

## 📁 Estrutura de Pastas

A estrutura da solução reflete a divisão de responsabilidades da Clean Architecture:

```text
📦 ApiControleEstoque (Root)
 ┣ 📂 StockManager.API           # Controllers, Middlewares, Program.cs, appsettings.json
 ┣ 📂 StockManager.Application   # Services, Interfaces de Aplicação, DTOs, Mappers
 ┣ 📂 StockManager.CrossCutting  # Injeção de Dependência (IoC), Autenticação
 ┣ 📂 StockManager.Domain        # Entidades, Enums, Interfaces de Repositório
 ┣ 📂 StockManager.Infrastructure# Contexto (EF Core), Mapeamentos (Fluent API), Migrations
 ┣ 📂 StockManager.Tests         # Testes de Unidade e Integração (xUnit, Moq)
 ┣ 📜 docker-compose.yml         # Container do SQL Server
 ┣ 📜 StockManager.slnx          # Arquivo da Solução .NET
 ┗ 📜 Insomnia_StockManager.json # Collection de endpoints para testes via Insomnia
```

---

## 🛠️ Tecnologias e Frameworks

O projeto utiliza um stack moderno, focado em performance, segurança e confiabilidade:

* **Linguagem:** C# (.NET 10.0)
* **Banco de Dados:** Microsoft SQL Server (via Docker)
* **ORM:** Entity Framework Core 10.0.7
* **Segurança e Autenticação:**
  * JWT (JSON Web Token) - Autenticação da API.
  * BCrypt.Net-Next - Hash e verificação segura de senhas.
* **Validação de Dados:** FluentValidation.AspNetCore
* **Testes Automatizados:** 
  * xUnit (Framework de testes)
  * Moq (Criação de mocks para testes unitários isolados)
  * FluentAssertions (Escrita de asserções fluentes e legíveis)
* **Outros:** Docker & Docker Compose para conteinerização rápida de serviços de infra.

---

## ⚙️ Instalação e Execução

### Pré-requisitos
* [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) instalado.
* [Docker Desktop](https://www.docker.com/products/docker-desktop) rodando.
* IDE de sua preferência (Visual Studio 2022, VS Code, Rider).

### Passos para rodar localmente

1. **Clone o repositório ou navegue até a pasta raiz do projeto:**
   ```bash
   cd ApiControleEstoque
   ```

2. **Suba o contêiner do Banco de Dados (SQL Server):**
   Execute o docker-compose para inicializar a instância local do banco.
   ```bash
   docker-compose up -d
   ```

3. **Restaure os pacotes e aplique as Migrations:**
   Dentro da pasta `StockManager.API`, aplique as tabelas ao banco de dados:
   ```bash
   cd StockManager.API
   dotnet restore
   dotnet ef database update -p ../StockManager.Infrastructure/StockManager.Infrastructure.csproj
   ```

4. **Inicie a API:**
   Ainda na pasta `StockManager.API`:
   ```bash
   dotnet run
   ```
   A API estará rodando, pronta para receber requisições através do Swagger (se configurado) ou através da collection do Insomnia (`Insomnia_StockManager.json` na raiz do projeto).

5. **Testes (Opcional):**
   Para rodar todos os testes automatizados da aplicação, na pasta raiz:
   ```bash
   dotnet test
   ```

---

## 📈 Escalabilidade Futura

Graças à sua fundação em Clean Architecture, o projeto está altamente preparado para crescer e incorporar novas tecnologias e abordagens sem o risco de refatorações destrutivas severas:

1. **Microsserviços:** A lógica de domínio bem delimitada facilita a extração de contextos isolados (como separar o Gerenciamento de Usuários do Controle de Inventário) caso o tráfego escale agressivamente.
2. **Mensageria e Eventos (Event-Driven Architecture):** Implementação de brokers (RabbitMQ/Kafka) para disparar eventos assíncronos (ex: notificação quando o estoque de um produto atingir o nível mínimo ou auditoria de movimentações).
3. **CQRS (Command Query Responsibility Segregation):** Separação clara entre operações de leitura (Queries - otimizadas com Dapper ou bancos NoSQL/Redis) e gravação (Commands - processados pelo EF Core), aumentando brutalmente a performance em cenários de alta concorrência.
4. **Caching Distribuído:** Incorporação de Redis na camada de Aplicação/Infraestrutura para armazenar temporariamente listagens de produtos muito acessadas e reduzir o uso do banco de dados relacional.
5. **CI/CD:** Pipelines automatizados no GitHub Actions/Azure DevOps já podem ser facilmente encaixados graças à cobertura com xUnit e conteinerização baseada em Docker.
