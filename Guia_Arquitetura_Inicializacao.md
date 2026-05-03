# Guia de Arquitetura e Fluxo de Inicialização — IgrejaV2

Este documento descreve como o ecossistema da aplicação IgrejaV2 é orquestrado, desde o código C# até os containers Docker.

## 1. Estrutura de Projetos

*   **`IgrejaV2.slnx`**: Arquivo de solução (Solution) que agrupa todos os projetos.
*   **`docker-compose.dcproj`**: Projeto de orquestração do Visual Studio. É ele quem habilita o botão "Play" para rodar múltiplos containers.
*   **`IgrejaV2.API`**: Camada de entrada (Host). Contém os Controllers e o `Program.cs`.
*   **`IgrejaV2.Aplicacao`**: Camada de lógica de negócio e serviços.
*   **`IgrejaV2.Infraestrutura`**: Camada de acesso a dados (Dapper/EF Core) e scripts SQL.
*   **`IgrejaV2.Dominio`**: O "coração" do sistema. Contém as Entidades e Interfaces.

---

## 2. Orquestração de Containers (Docker)

O sistema utiliza o **Docker Compose** para garantir consistência entre o banco e a aplicação.

### Fluxo de Subida:
1.  **PostgreSQL (`igrejav2-postgres`)**: Inicia primeiro com a imagem `16-alpine`.
    *   Possui um `healthcheck` que verifica periodicamente se o banco já aceita conexões (`pg_isready`).
2.  **API (`igrejav2-api`)**: Aguarda o banco estar saudável (`service_healthy`) antes de iniciar.
    *   As variáveis de ambiente no `docker-compose.yml` sobrescrevem as configurações do `appsettings.json` (ex: Connection String).

---

## 3. Fluxo de Inicialização do Código (Program.cs)

Ao iniciar a API, o seguinte fluxo é executado:

1.  **Injeção de Dependência (`AddInfraestrutura`)**:
    *   Registra os `DbContext` do EF Core.
    *   Configura os repositórios (Dapper ou EF) conforme o arquivo de configuração.
    *   Registra o componente `IInicializadorBanco`.

2.  **Criação Automática de Tabelas (DDL)**:
    *   A aplicação cria um `IServiceScope` logo no startup.
    *   O `InicializadorBancoDapper` lê o arquivo `01_TabelasIniciais.sql`.
    *   O script é executado no banco, garantindo que a estrutura de tabelas esteja sempre atualizada sem depender de Migrations manuais por enquanto.

3.  **Habilitação do Swagger**:
    *   Em modo `Development`, a interface visual do Swagger é habilitada para testes de endpoint.

---

## 4. Como Desenvolver e Debugar

### Rodando o Sistema:
*   Selecione o projeto **`docker-compose`** no dropdown de inicialização do Visual Studio.
*   Aperte **F5 (Play)**.
*   O navegador abrirá automaticamente na página do Swagger.

### Banco de Dados:
*   Para conectar via ferramentas externas (PgAdmin, DBeaver):
    *   **Host**: `localhost`
    *   **Porta**: `5432`
    *   **Usuário/Senha**: `postgres` / `postgres`

### Adicionando Novos Scripts SQL:
1.  Crie o arquivo `.sql` na pasta `Scripts/` do projeto de Infraestrutura.
2.  O arquivo será automaticamente copiado para o container graças à configuração no `.csproj`.
