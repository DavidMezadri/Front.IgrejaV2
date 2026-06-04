# IgrejaV2 — Regras e Contexto

## Projetos

**Frontend**: Vite + React + TypeScript (Atomic Design)  
**Backend**: .NET 8 + PostgreSQL (Clean Architecture, usando **Dapper**)

---

## Code style

- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any`, no `Dict`, no untyped functions (TypeScript/C#).
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.

## Comments

- Keep your own comments. Don't strip them on refactor — they carry
  intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- XML docstrings on public methods (C#): intent + one usage example.
  Format: `/// <summary>... </summary>` + `/// <response>` codes.
- Reference issue numbers / commit SHAs when a line exists because
  of a specific bug or upstream constraint.

## Tests

- Tests run with a single command: `npm test` (frontend), `dotnet test` (backend).
- Every new function gets a test. Bug fixes get a regression test.
- Mock external I/O (API, DB, filesystem) with named fake classes,
  not inline stubs.
- Tests must be F.I.R.S.T: fast, independent, repeatable,
  self-validating, timely.

## Dependencies

- Inject dependencies through constructor/parameter, not global/import.
- Wrap third-party libs behind a thin interface owned by this project.
- **Backend**: registra tudo em `Program.cs` com `builder.Services.AddXxx()`.

## Structure

### Backend: Clean Architecture (4 camadas)

```
IgrejaV2.Dominio/          → Entidades, enums, interfaces de repositório
IgrejaV2.Aplicacao/Servico → DTOs, lógica de negócio, mapeamento
IgrejaV2.Infraestrutura/   → Repositórios (Dapper/EF), inicialização do DB
IgrejaV2.API/              → Controllers, Token, Swagger
```

- **Controllers**: thin wrappers, apenas rotas + validação básica.
- **Serviços (Aplicação)**: lógica de negócio, validações, logging.
- **Repositórios**: acesso a dados via Dapper (SQL manual + `CommandDefinition`).
- **Entidades (Domínio)**: modelos puros, sem dependências.

### Frontend: Vite + React + Atomic Design

```
src/components/
  atoms/          → componentes básicos (Button, Input, etc)
  molecules/      → compostos de atoms (FormField, Modal, etc)
  organisms/      → seções grandes (Header, Sidebar, etc)
  templates/      → layouts (AdminLayout, PublicLayout, etc)
pages/            → páginas (rotas Top)
services/         → chamadas API (enderecoService.ts, pessoaService.ts, etc)
utils/            → helpers (cepFormatter.ts, etc)
api/              → endpoints centralizados (endpoints.ts)
```

## Dapper + PostgreSQL (Backend)

- **SQL manual** usando `Dapper.QueryAsync<T>`, `ExecuteAsync`.
- Sempre use `CommandDefinition` para suportar `CancellationToken`.
- Mapeamento automático: `DefaultTypeMap.MatchNamesWithUnderscores = true`.
- Padrão: `public abstract string NomeTabela` em `RepositorioBaseDapper<T>`.
- Queries com parâmetros nomeados (`@Chave`, `@Valor`), nunca string interpolation.
- Retorna `RETURNING` no INSERT/UPDATE quando precisa do ID/dados novos.

## Autenticação e Autorização

- **JWT Bearer**: token gerado em `POST /api/auth/login`.
- **Token Service**: assina com chave do `appsettings.json`.
- **Endpoints**: `[Authorize]` no controller para proteger rotas.
- **Frontend**: armazena token em `localStorage`, passa em `Authorization: Bearer {token}`.
- **CORS**: configurado para `localhost:3000`, `localhost:5173`, `localhost:8080`.

## Logging

- **Structured JSON**: `LogServico` registra ações (Criacao, Edicao, Delecao) com `AcaoLogEnum`.
- Inclui: `Nome da tabela`, `ID registro`, `descrição`, `dadosAnteriores`, `dadosNovos`.
- Plain text apenas para output CLI do usuário.

## Formatting

- **Frontend**: `prettier` (rodar com `npm run format` ou IDE).
- **Backend**: `dotnet format` (C# style padrão).

## API Conventions

- **REST routes**: `GET /api/entidade`, `POST /api/entidade`, `PUT /api/entidade/{id}`, `DELETE /api/entidade/{id}`.
- **Response DTOs**: sufixo `Dto` (ex: `PessoaResponseDto`, `CriarPessoaDto`).
- **Status codes**:
  - `201 Created`: POST bem-sucedido (inclui header `Location`).
  - `200 OK`: GET/PUT bem-sucedido.
  - `204 No Content`: DELETE bem-sucedido.
  - `400 Bad Request`: validação falhou (DTO inválido).
  - `404 Not Found`: recurso não encontrado.
  - `401 Unauthorized`: sem autenticação.
  - `403 Forbidden`: sem autorização.

## Validação

- **Aplicação**: valida regras de negócio (FK existentes, obrigatoriedade).
- Não depende de constraints do banco — falha com `InvalidOperationException` com mensagem clara.
- **DTO**: validação de formato (email, tipo, intervalo) via Data Annotations (C#) ou frontend (React).
