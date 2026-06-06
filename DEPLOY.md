# 🚀 Deploy CI/CD - Igreja V2

Guia completo para fazer deploy automático na VPS Oracle ARM.

## 📋 Arquitetura

```
GitHub Actions (build + push)
           ↓
GitHub Container Registry (GHCR)
           ↓
VPS Oracle ARM (pull + docker-compose up)
           ↓
nginx (reverse proxy)
           ↓
Frontend (port 3000) + Backend (port 8080)
```

## 🔧 Setup Inicial na VPS

### 1. SSH na VPS
```bash
ssh seu_usuario@seu_ip_vps
```

### 2. Execute o script de setup
```bash
curl -O https://raw.githubusercontent.com/seu-usuario/front-igrejav2/main/deploy-setup.sh
sudo bash deploy-setup.sh
```

Ou manualmente:
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
mkdir -p /opt/igrejav2
cd /opt/igrejav2
```

### 3. Copie os arquivos de configuração para a VPS
```bash
scp docker-compose.yml seu_usuario@seu_ip:/opt/igrejav2/
scp nginx.conf seu_usuario@seu_ip:/opt/igrejav2/
```

## 🔐 Configurar GitHub Actions Secrets

Na página do repositório → Settings → Secrets and variables → Actions

Adicione:

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP da sua VPS (ex: 123.45.67.89) |
| `VPS_USER` | Usuário SSH da VPS (ex: ubuntu) |
| `VPS_SSH_KEY` | Sua chave SSH privada (cat ~/.ssh/id_rsa) |

### Como gerar chave SSH:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/vps_deploy
```

Adicione a chave pública na VPS:
```bash
cat ~/.ssh/vps_deploy.pub >> ~/.ssh/authorized_keys
```

Use a chave privada como secret no GitHub.

## 📦 Variáveis de Ambiente

Edite `/opt/igrejav2/.env` na VPS:

```env
VITE_API_URL=http://localhost:8080
ASPNETCORE_ENVIRONMENT=Production
```

## 🔄 Fluxo de Deploy

### Automático (Recomendado)
```bash
git commit -m "feat: algo novo"
git push origin main
# ↓ GitHub Actions faz:
# 1. Build da imagem Docker (ARM64)
# 2. Push para GHCR
# 3. SSH na VPS
# 4. docker-compose pull
# 5. docker-compose up -d
```

### Manual
```bash
cd /opt/igrejav2
docker-compose pull
docker-compose up -d
```

## 🐳 Comandos Úteis na VPS

```bash
# Ver containers rodando
docker ps

# Ver logs do frontend
docker logs igrejav2-frontend

# Ver logs do nginx
docker logs igrejav2-nginx

# Reiniciar tudo
docker-compose restart

# Parar tudo
docker-compose down

# Limpar imagens antigo
docker system prune -a
```

## 🌐 Acessar a Aplicação

Frontend: `http://seu_ip_vps`
Backend: `http://seu_ip_vps/api/*`

## 📝 Backend .NET

Para adicionar o backend:

1. Crie um repositório para o backend: `IgrejaV2.API`
2. Adicione um Dockerfile similar:
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder
WORKDIR /src
COPY ["IgrejaV2.API.csproj", "./"]
RUN dotnet restore "IgrejaV2.API.csproj"
COPY . .
RUN dotnet build "IgrejaV2.API.csproj" -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=builder /app/build .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "IgrejaV2.API.dll"]
```

3. Descomente a seção `backend` no `docker-compose.yml`

## 🔐 SSL/HTTPS (Opcional)

Para adicionar HTTPS:

1. Crie certificado (Let's Encrypt):
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d seu_dominio.com
```

2. Copie certificados para VPS:
```bash
scp -r /etc/letsencrypt/live/seu_dominio.com seu_usuario@vps:/opt/igrejav2/ssl/
```

3. Edite `nginx.conf` para usar HTTPS

## 📊 Monitoramento

Instale ferramentas de monitoramento (opcional):
```bash
docker run -d \
  --name=portainer \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  portainer/portainer-ce:latest
```

Acesse: `http://seu_ip:9000`

## 🚨 Troubleshooting

**Container não inicia:**
```bash
docker logs igrejav2-frontend
```

**Erro de CORS:**
Verifique `nginx.conf` - adicione headers corretos

**Frontend não conecta ao backend:**
Verifique URL no `.env` - deve ser `http://localhost:8080` (ou seu domínio)

**Erro 405 de presenças:**
Já foi tratado no código com try/catch

## 📚 Referências

- [Docker Buildx ARM](https://docs.docker.com/buildx/working-with-buildx/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Proxy](https://nginx.org/en/docs/)
