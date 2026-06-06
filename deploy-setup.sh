#!/bin/bash
# Setup inicial da VPS para rodar os containers

set -e

echo "🔧 Setup de Deploy - Igreja V2"
echo "=============================="

# Verifica se é root
if [ "$EUID" -ne 0 ]; then
   echo "❌ Execute como root: sudo bash deploy-setup.sh"
   exit 1
fi

# Atualiza sistema
echo "📦 Atualizando sistema..."
apt-get update
apt-get upgrade -y

# Instala Docker
echo "🐳 Instalando Docker..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Instala Docker Compose standalone
echo "📝 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Cria diretório do projeto
echo "📂 Criando estrutura de pastas..."
mkdir -p /opt/igrejav2
cd /opt/igrejav2

# Cria arquivo .env
echo "⚙️ Criando arquivo .env..."
cat > .env << 'EOF'
# Frontend
VITE_API_URL=http://localhost:8080

# Backend (quando disponível)
# ASPNETCORE_ENVIRONMENT=Production
# DB_CONNECTION_STRING=your_connection_string_here
EOF

# Inicializa docker-compose (será preenchido pelo GitHub Actions)
echo "✅ Setup concluído!"
echo ""
echo "📝 Próximos passos:"
echo "1. Copie os arquivos docker-compose.yml e nginx.conf para /opt/igrejav2"
echo "2. Configure os secrets do GitHub Actions (VPS_HOST, VPS_USER, VPS_SSH_KEY)"
echo "3. Faça um push para main para iniciar o primeiro deploy"
echo ""
echo "📍 Localização do projeto: /opt/igrejav2"
