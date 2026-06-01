# 📸 Especificação: Upload de Imagens (Home Banner)

## Objetivo
Criar endpoint para upload de imagens do banner da Home e retornar URL para salvar no ConfigController.

---

## 1. Controller: UploadController

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Igreja.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHost;
        private readonly string UPLOAD_PATH = "wwwroot/uploads/images";

        public UploadController(IWebHostEnvironment webHost)
        {
            _webHost = webHost;
        }

        /// <summary>
        /// POST /api/upload/imagem
        /// Faz upload de imagem e retorna URL
        /// </summary>
        [HttpPost("imagem")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImagem([FromForm] IFormFile arquivo)
        {
            if (arquivo == null || arquivo.Length == 0)
                return BadRequest(new { mensagem = "Nenhum arquivo enviado" });

            // Validar extensão
            var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extensao = Path.GetExtension(arquivo.FileName).ToLower();
            if (!Array.Exists(extensoesPermitidas, ext => ext == extensao))
                return BadRequest(new { mensagem = "Formato de imagem inválido. Aceito: jpg, png, gif, webp" });

            // Validar tamanho (máx 5MB)
            if (arquivo.Length > 5 * 1024 * 1024)
                return BadRequest(new { mensagem = "Arquivo muito grande. Máximo 5MB" });

            try
            {
                // Criar diretório se não existir
                var uploadDir = Path.Combine(_webHost.ContentRootPath, UPLOAD_PATH);
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);

                // Gerar nome único
                var nomeArquivo = $"{Guid.NewGuid()}{extensao}";
                var caminhoCompleto = Path.Combine(uploadDir, nomeArquivo);

                // Salvar arquivo
                using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                {
                    await arquivo.CopyToAsync(stream);
                }

                // Retornar URL relativa
                var urlRelativa = $"/uploads/images/{nomeArquivo}";
                return Ok(new { 
                    url = urlRelativa,
                    nomeArquivo = nomeArquivo,
                    mensagem = "Upload realizado com sucesso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    mensagem = "Erro ao fazer upload", 
                    erro = ex.Message 
                });
            }
        }

        /// <summary>
        /// DELETE /api/upload/imagem/{nomeArquivo}
        /// Remove imagem do servidor
        /// </summary>
        [HttpDelete("imagem/{nomeArquivo}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteImagem(string nomeArquivo)
        {
            if (string.IsNullOrWhiteSpace(nomeArquivo))
                return BadRequest(new { mensagem = "Nome do arquivo não fornecido" });

            try
            {
                var caminhoCompleto = Path.Combine(_webHost.ContentRootPath, UPLOAD_PATH, nomeArquivo);
                
                // Segurança: verificar se está dentro do diretório permitido
                var uploadDirFull = Path.Combine(_webHost.ContentRootPath, UPLOAD_PATH);
                if (!Path.GetFullPath(caminhoCompleto).StartsWith(Path.GetFullPath(uploadDirFull)))
                    return BadRequest(new { mensagem = "Caminho inválido" });

                if (System.IO.File.Exists(caminhoCompleto))
                {
                    System.IO.File.Delete(caminhoCompleto);
                    return Ok(new { mensagem = "Imagem deletada com sucesso" });
                }

                return NotFound(new { mensagem = "Arquivo não encontrado" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    mensagem = "Erro ao deletar imagem", 
                    erro = ex.Message 
                });
            }
        }
    }
}
```

---

## 2. Configurar wwwroot no Program.cs

```csharp
// Em Program.cs, adicionar:

// Servir arquivos estáticos da pasta wwwroot
app.UseStaticFiles();

// Opcionalmente, servir uma pasta customizada
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot")),
    RequestPath = ""
});
```

---

## 3. Estrutura de Pastas

Criar no backend:
```
Igreja.API/
├── wwwroot/
│   └── uploads/
│       └── images/          ← Aqui as imagens são salvas
```

---

## 4. Teste da API

### POST /api/upload/imagem
**Request:**
```
POST http://localhost:8080/api/upload/imagem
Authorization: Bearer {token_admin}
Content-Type: multipart/form-data

arquivo: [binary image file]
```

**Response (sucesso):**
```json
{
  "url": "/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
  "nomeArquivo": "550e8400-e29b-41d4-a716-446655440000.jpg",
  "mensagem": "Upload realizado com sucesso"
}
```

**Response (erro):**
```json
{
  "mensagem": "Arquivo muito grande. Máximo 5MB"
}
```

### DELETE /api/upload/imagem/{nomeArquivo}
**Request:**
```
DELETE http://localhost:8080/api/upload/imagem/550e8400-e29b-41d4-a716-446655440000.jpg
Authorization: Bearer {token_admin}
```

**Response:**
```json
{
  "mensagem": "Imagem deletada com sucesso"
}
```

---

## 5. Como Usar no Frontend

1. Admin faz upload da imagem em `AdminCMS.tsx`
2. Backend retorna URL: `/uploads/images/550e8400...jpg`
3. Salvar no ConfigController: `"home.fotoBanner": "/uploads/images/550e8400...jpg"`
4. Home.tsx carrega e passa para HeroClassic
5. HeroClassic exibe a imagem

---

## 6. Fluxo Completo

```
[Admin faz upload] 
    ↓
[POST /api/upload/imagem] 
    ↓
[Backend retorna URL] 
    ↓
[Frontend salva em config] 
    ↓
[PUT /api/config com home.fotoBanner]
    ↓
[Home carrega config e exibe imagem]
```

---

## ✅ Checklist de Implementação

- [ ] Criar `UploadController.cs`
- [ ] Criar pasta `wwwroot/uploads/images/`
- [ ] Configurar `UseStaticFiles()` em `Program.cs`
- [ ] Testar POST /api/upload/imagem com Postman
- [ ] Testar DELETE /api/upload/imagem/{nome} com Postman
- [ ] Verificar se a URL retornada funciona (acessar no navegador)
- [ ] Implementar frontend no AdminCMS.tsx (próximo passo)

---

## 📝 Próximos Passos (Frontend)

Após backend implementado:
1. Adicionar input file em AdminCMS.tsx (aba Home)
2. Enviar para POST /api/upload/imagem
3. Salvar URL retornada em config via PUT /api/config
4. Modificar HeroClassic para aceitar `fotoBanner` prop
5. Exibir imagem no HeroClassic

