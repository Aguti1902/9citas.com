#!/bin/bash

echo "🚀 INSTALACIÓN COMPLETA Y EJECUCIÓN DE 9CITAS"
echo "=============================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
}

print_ok() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# PASO 1: Verificar PostgreSQL
print_step "Verificando PostgreSQL..."
if ! pg_isready > /dev/null 2>&1; then
    echo "PostgreSQL no está corriendo. Intentando iniciar..."
    pg_ctl -D /opt/homebrew/var/postgresql@14 start -l /tmp/postgres.log 2>/dev/null || brew services start postgresql@14
    sleep 3
    if ! pg_isready > /dev/null 2>&1; then
        print_error "PostgreSQL no se pudo iniciar. Ejecuta: ./start-postgres.sh"
    fi
fi
print_ok "PostgreSQL está corriendo"

# PASO 2: Crear base de datos
print_step "Creando base de datos..."
psql -U postgres -lqt | cut -d \| -f 1 | grep -qw 9citas && dropdb -U postgres 9citas 2>/dev/null
createdb -U postgres 9citas 2>/dev/null || createdb 9citas 2>/dev/null
print_ok "Base de datos creada"

# PASO 3: Instalar dependencias raíz
print_step "Instalando dependencias raíz..."
npm install --silent
print_ok "Dependencias raíz instaladas"

# PASO 4: Backend
print_step "Configurando Backend..."
cd backend

# Instalar dependencias
npm install --silent
print_ok "Dependencias backend instaladas"

# Crear .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:@localhost:5432/9citas?schema=public"
JWT_ACCESS_SECRET="9citas-super-secret-access-key-2024"
JWT_REFRESH_SECRET="9citas-super-secret-refresh-key-2024"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
ADMIN_PASSWORD="admin123"
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
EOF
print_ok "Backend .env creado"

# Prisma
npx prisma generate > /dev/null 2>&1
print_ok "Prisma generado"

npx prisma db push --accept-data-loss > /dev/null 2>&1
print_ok "Base de datos migrada"

npm run db:seed > /dev/null 2>&1
print_ok "Datos de prueba generados"

mkdir -p uploads
print_ok "Carpeta uploads creada"

# PASO 5: Frontend
print_step "Configurando Frontend..."
cd ../frontend

npm install --silent
print_ok "Dependencias frontend instaladas"

cat > .env << 'EOF'
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
EOF
print_ok "Frontend .env creado"

cd ..

# PASO 6: Limpiar procesos en puertos
print_step "Limpiando puertos..."
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2
print_ok "Puertos liberados"

# PASO 7: Iniciar aplicación
echo ""
echo "=============================================="
echo -e "${GREEN}✓ INSTALACIÓN COMPLETA${NC}"
echo "=============================================="
echo ""
echo "🌐 Iniciando aplicación..."
echo ""
echo "Backend:  http://localhost:4000"
echo "Frontend: http://localhost:3000"
echo "Admin:    http://localhost:3000/admin"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

npm run dev
