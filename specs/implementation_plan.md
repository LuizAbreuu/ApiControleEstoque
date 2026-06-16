# Implementação do Frontend: Stock Manager Web

Este documento descreve o plano arquitetural e de execução para o desenvolvimento do frontend do **Stock Manager Web**, um sistema administrativo de gerenciamento de estoque enterprise. O projeto será construído utilizando Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, e as melhores práticas das skills recomendadas.

## User Review Required

> [!IMPORTANT]
> **Aprovação do Plano e Fase 1:** Por favor, revise este plano detalhado. Se você concordar, procederemos com a execução da **Fase 1**, que inclui o setup do projeto Next.js, configuração do Tailwind CSS v4, shadcn/ui e a estrutura base de pastas e estado global.

## Open Questions

> [!WARNING]
> 1. **Repositório:** Devemos criar o projeto Next.js em um novo diretório dentro do atual (`ApiControleEstoque/frontend`, por exemplo) ou na raiz atual (assumindo que a API está em outro local ou pasta isolada)? Assumirei a criação em uma subpasta `frontend` ou equivalente, por favor, confirme o caminho desejado para rodar o comando de criação do Next.js.
> 2. **Configuração da API URL:** Existe alguma URL base de desenvolvimento predefinida (ex: `https://localhost:5001/api`) que devemos usar por padrão nos serviços axios?

## Proposta Arquitetural e Tecnologias

O frontend utilizará uma **Arquitetura Modular por Domínio**, isolando componentes, hooks, schemas e types por módulo de negócio para garantir escalabilidade.

**Stack Tecnológica Obrigatória:**
- Next.js (App Router)
- React & TypeScript (Tipagem forte)
- Estilização: Tailwind CSS (v4 com Design System) + shadcn/ui
- Fetching & Cache: Axios + TanStack Query (React Query)
- Estado Global (Sessão/Auth): Zustand
- Formulários: React Hook Form + Zod
- Tabelas: TanStack Table
- Utilitários: date-fns, lucide-react

**Estilo Visual & UX:**
A interface terá uma aparência corporativa, moderna e limpa, otimizada para a produtividade. Seguiremos as diretrizes de UX exigidas:
- **Cores semânticas:** Verde (sucesso/entrada), Vermelho (erro/vencido/saída), Amarelo/Laranja (alerta/estoque baixo), Azul (ações principais).
- Layout responsivo (foco desktop/notebook) com barra lateral fixa, cabeçalho e uso abundante de tabelas interativas e cards de métricas.

## Fases de Implementação

Seguiremos rigorosamente as fases estabelecidas.

### Fase 1: Setup e Fundação
- Inicialização do projeto Next.js com App Router.
- Configuração do Tailwind CSS e Design Tokens corporativos (`tailwind-design-system`).
- Instalação e configuração inicial do `shadcn/ui`.
- Criação da estrutura de pastas modular (app, components, modules, services, stores, etc).
- Setup base do Axios (interceptors) e TanStack QueryClient.
- Implementação da store de Auth (Zustand).

### Fase 2: Layout Base e Autenticação
- Implementação dos layouts globais (`AppShell`, `AppSidebar`, `AppHeader`).
- Criação do módulo de Auth (schemas, services, hooks).
- Página de Login e lógica de persistência do JWT.
- Proteção de rotas do painel com hooks de verificação (`useAuth`, `usePermissions`).

### Fase 3: Dashboard e Home
- Layout do Dashboard com cards métricos (Total produtos, estoque baixo, lotes a vencer).
- Componentes de gráficos simplificados ou estatísticas visuais.
- Tabela resumida de últimas movimentações.

### Fase 4: Módulo de Produtos
- Listagem completa com `TanStack Table` (paginação, ordenação, filtros).
- Formulários de Cadastro e Edição com `React Hook Form` e `Zod`.
- Visualização de detalhes do produto.

### Fase 5: Módulo de Lotes
- Tabelas de lotes vinculados a produtos, controlando status visual de vencimentos.
- Ações para registrar ou gerir lotes específicos (caso a API o exija independentemente de entradas de estoque).

### Fase 6: Módulo de Estoque (Movimentações)
- Interface tabulada para Entrada, Saída, Ajuste e Descarte.
- Regras de validação para ajustes e descartes (exigência de motivo).
- Histórico tabulado de todas as movimentações.

### Fase 7: Relatórios
- Listagens de visões gerenciais (estoque baixo, vencidos, próximos do vencimento).
- Preparação dos componentes para exportação de dados (Excel/CSV se a API permitir).

### Fase 8: Usuários e Configurações (Admin)
- Gestão de acessos, listagem e edição de perfis (Employee vs Admin).
- Tratamento de visibilidade baseado em roles na UI.

## Verification Plan

### Automated/Build Verification
- O projeto deve compilar com `npm run build` ou `npm run dev` sem erros de lint ou type.
- Os schemas do Zod garantirão validação correta em runtime durante o preenchimento de forms e parse de APIs.

### Manual Verification
- Teste interativo do layout responsivo via navegador.
- Teste do fluxo de autenticação e expiração de token.
- Verificação visual dos componentes shadcn/ui.
- Interação completa com formulários para verificar o comportamento do Zod e tratamento de erros visuais (toasts).
