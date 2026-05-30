# 📋 Especificação: ConfigController para CMS

## Objetivo
Criar um sistema de configurações dinâmicas para gerenciar conteúdo das páginas públicas (Home, Footer, Sobre) via API REST.

---

## 1. DTO: ConfigDto

```csharp
namespace Igreja.Aplicacao.DTOs.Config
{
    public class ConfigDto
    {
        public string Chave { get; set; }    // Exemplo: "home.titulo"
        public string Valor { get; set; }    // Exemplo: "Um lugar para encontrar a Cristo"
    }
}
```

**Exemplos de chaves esperadas:**

| Chave | Descrição | Exemplo |
|-------|-----------|---------|
| `home.titulo` | Título principal do banner | "Um lugar para encontrar a Cristo, a si mesmo, e ao próximo" |
| `home.subtitulo` | Subtítulo/descrição | "Domingos às 9h e 19h no centro da cidade" |
| `home.textoApoio` | Texto de apoio | "Uma comunidade que busca crescer juntos" |
| `home.horarios` | Horários de funcionamento | "Domingos: 9h e 19h" |
| `igreja.nome` | Nome da instituição | "Comunidade da Graça" |
| `igreja.lema` | Lema/frase | "Uma igreja para a cidade" |
| `igreja.endereco` | Endereço completo | "Rua das Acácias, 248 — Centro" |
| `igreja.telefone` | Telefone de contato | "(11) 3000-0000" |
| `igreja.email` | Email institucional | "contato@comunidadedagraca.com" |
| `sobre.texto` | Texto descritivo da comunidade | "Somos uma comunidade..." |

---

## 2. Controller: ConfigController

```csharp
using Igreja.Aplicacao.DTOs.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Igreja.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        // Injetar repositório/serviço conforme sua arquitetura
        private readonly IConfigServico _configServico;

        public ConfigController(IConfigServico configServico)
        {
            _configServico = configServico;
        }

        /// <summary>
        /// GET /api/config
        /// Retorna todas as configurações em formato Dictionary
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var configs = await _configServico.ObterTodasAsync();
                
                // Converter List<ConfigDto> para Dictionary<string, string>
                var resultado = new Dictionary<string, string>();
                foreach (var config in configs)
                {
                    resultado[config.Chave] = config.Valor;
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao carregar configurações", erro = ex.Message });
            }
        }

        /// <summary>
        /// PUT /api/config
        /// Atualiza múltiplas configurações
        /// </summary>
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromBody] List<ConfigDto> configs)
        {
            if (configs == null || configs.Count == 0)
            {
                return BadRequest(new { mensagem = "Nenhuma configuração para atualizar" });
            }

            try
            {
                await _configServico.AtualizarAsync(configs);
                return Ok(new { mensagem = "Configurações atualizadas com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao atualizar configurações", erro = ex.Message });
            }
        }
    }
}
```

---

## 3. Serviço: IConfigServico

```csharp
using Igreja.Aplicacao.DTOs.Config;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Igreja.Aplicacao.Servicos
{
    public interface IConfigServico
    {
        Task<List<ConfigDto>> ObterTodasAsync();
        Task AtualizarAsync(List<ConfigDto> configs);
    }
}
```

---

## 4. Implementação do Serviço: ConfigServico

```csharp
using Igreja.Aplicacao.DTOs.Config;
using Igreja.Dominio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Igreja.Aplicacao.Servicos
{
    public class ConfigServico : IConfigServico
    {
        private readonly IRepositorioConfig _repositorio;

        public ConfigServico(IRepositorioConfig repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<ConfigDto>> ObterTodasAsync()
        {
            var configs = await _repositorio.ObterTodasAsync();
            return configs.Select(c => new ConfigDto
            {
                Chave = c.Chave,
                Valor = c.Valor
            }).ToList();
        }

        public async Task AtualizarAsync(List<ConfigDto> dtos)
        {
            if (dtos == null || dtos.Count == 0)
                throw new ArgumentException("Nenhuma configuração para atualizar");

            foreach (var dto in dtos)
            {
                if (string.IsNullOrWhiteSpace(dto.Chave))
                    throw new ArgumentException("Chave não pode ser vazia");

                await _repositorio.AtualizarOuCriarAsync(dto.Chave, dto.Valor);
            }
        }
    }
}
```

---

## 5. Entidade: Configuracao (Modelo)

```csharp
namespace Igreja.Dominio.Entidades
{
    public class Configuracao
    {
        public int Id { get; set; }
        public string Chave { get; set; }      // Chave única
        public string Valor { get; set; }      // Valor em string/JSON
        public DateTime CriadoEm { get; set; }
        public DateTime AtualizadoEm { get; set; }
    }
}
```

---

## 6. Repositório: IRepositorioConfig

```csharp
using Igreja.Dominio.Entidades;
using Igreja.Dominio.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Igreja.Dominio.Interfaces
{
    public interface IRepositorioConfig : IRepositorio<Configuracao>
    {
        Task<Configuracao> ObterPorChaveAsync(string chave);
        Task<List<Configuracao>> ObterTodasAsync();
        Task AtualizarOuCriarAsync(string chave, string valor);
    }
}
```

---

## 7. Implementação do Repositório: RepositorioConfig

```csharp
using Igreja.Dominio.Entidades;
using Igreja.Dominio.Interfaces;
using Igreja.Infraestrutura.Contexto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Igreja.Infraestrutura.Repositorios
{
    public class RepositorioConfig : RepositorioGenerico<Configuracao>, IRepositorioConfig
    {
        public RepositorioConfig(IgrejaDbContext contexto) : base(contexto)
        {
        }

        public async Task<Configuracao> ObterPorChaveAsync(string chave)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Chave == chave);
        }

        public async Task<List<Configuracao>> ObterTodasAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task AtualizarOuCriarAsync(string chave, string valor)
        {
            var config = await ObterPorChaveAsync(chave);

            if (config == null)
            {
                // Criar nova
                config = new Configuracao
                {
                    Chave = chave,
                    Valor = valor,
                    CriadoEm = DateTime.UtcNow,
                    AtualizadoEm = DateTime.UtcNow
                };
                await AdicionarAsync(config);
            }
            else
            {
                // Atualizar existente
                config.Valor = valor;
                config.AtualizadoEm = DateTime.UtcNow;
                await AtualizarAsync(config);
            }
        }
    }
}
```

---

## 8. Configuração do EF Core: ConfigurracaoConfiguacao

```csharp
using Igreja.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Igreja.Infraestrutura.Contexto.Configuracoes
{
    public class ConfiguracaoConfiguracao : IEntityTypeConfiguration<Configuracao>
    {
        public void Configure(EntityTypeBuilder<Configuracao> builder)
        {
            builder.ToTable("Configuracoes");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Chave)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.Valor)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(c => c.CriadoEm)
                .HasDefaultValue(DateTime.UtcNow);

            builder.Property(c => c.AtualizadoEm)
                .HasDefaultValue(DateTime.UtcNow);

            // Índice único na chave
            builder.HasIndex(c => c.Chave)
                .IsUnique();
        }
    }
}
```

---

## 9. Injeção de Dependência (Program.cs)

```csharp
// Em Program.cs, adicionar:

builder.Services.AddScoped<IRepositorioConfig, RepositorioConfig>();
builder.Services.AddScoped<IConfigServico, ConfigServico>();
```

---

## 10. Migração do Banco de Dados

```bash
# No Package Manager Console:
Add-Migration AddConfiguracaoTable
Update-Database
```

---

## 11. Teste da API

### GET /api/config
**Resposta esperada:**
```json
{
  "home.titulo": "Um lugar para encontrar a Cristo, a si mesmo, e ao próximo",
  "home.subtitulo": "Domingos às 9h e 19h",
  "home.textoApoio": "Uma comunidade que busca crescer juntos",
  "home.horarios": "Domingos: 9h e 19h",
  "igreja.nome": "Comunidade da Graça",
  "igreja.lema": "Uma igreja para a cidade",
  "igreja.endereco": "Rua das Acácias, 248 — Centro",
  "igreja.telefone": "(11) 3000-0000",
  "igreja.email": "contato@comunidadedagraca.com",
  "sobre.texto": "Somos uma comunidade..."
}
```

### PUT /api/config
**Request esperado:**
```json
[
  { "chave": "home.titulo", "valor": "Novo Título" },
  { "chave": "igreja.nome", "valor": "Nova Igreja" }
]
```

**Resposta esperada:**
```json
{
  "mensagem": "Configurações atualizadas com sucesso"
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar DTO `ConfigDto.cs`
- [ ] Criar Entidade `Configuracao.cs`
- [ ] Criar Interface `IRepositorioConfig.cs`
- [ ] Criar Repositório `RepositorioConfig.cs`
- [ ] Criar Interface `IConfigServico.cs`
- [ ] Criar Serviço `ConfigServico.cs`
- [ ] Criar Controller `ConfigController.cs`
- [ ] Criar Configuração EF Core `ConfiguracaoConfiguracao.cs`
- [ ] Adicionar injeção de dependência em `Program.cs`
- [ ] Criar migração e executar `Update-Database`
- [ ] Testar endpoints GET e PUT com Postman/cURL
- [ ] Confirmar que GET retorna `Dictionary<string, string>`
- [ ] Confirmar que PUT aceita `List<ConfigDto>`

---

## 📝 Próximos Passos (Frontend)

Após a implementação backend, o frontend criará:

1. **Hook `usePageConfig`** — para carregar `/api/config`
2. **Página `AdminCMS.tsx`** — com 3 abas (Home, Igreja, Sobre)
3. **Componentes públicos atualizados** — para consumir dados do config
4. **Menu AdminLayout** — com link para CMS

