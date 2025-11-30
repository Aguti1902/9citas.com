#!/bin/bash

# Script de instalación rápida para 9citas.com
# Uso: ./quick-start.sh

set -e

echo "🚀 Iniciando instalación de 9citas.com..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi
print_status "Node.js $(node --version) detectado"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL no está instalado. Instálalo con: brew install postgresql@14"
    exit 1
fi
print_status "PostgreSQL $(psql --version | awk '{print $3}') detectado"

# Verificar que PostgreSQL está corriendo
if ! pg_isready &> /dev/null; then
    print_warning "PostgreSQL no está corriendo. Intentando iniciar..."
    brew services start postgresql@14 || {
        print_error "No se pudo iniciar PostgreSQL. Inícialo manualmente."
        exit 1
    }
    sleep 3
fi
print_status "PostgreSQL está corriendo"

# Crear base de datos
echo ""
echo "📊 Configurando base de datos..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw 9citas; then
    print_warning "La base de datos '9citas' ya existe"
    read -p "¿Quieres eliminarla y crearla de nuevo? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        dropdb 9citas 2>/dev/null || dropdb -U postgres 9citas
        createdb 9citas 2>/dev/null || createdb -U postgres 9citas
        print_status "Base de datos recreada"
    fi
else
    createdb 9citas 2>/dev/null || createdb -U postgres 9citas
    print_status "Base de datos '9citas' creada"
fi

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
print_status "Instalando dependencias raíz..."
npm install --silent

cd backend
print_status "Instalando dependencias del backend..."
npm install --silent

cd ../frontend
print_status "Instalando dependencias del frontend..."
npm install --silent
cd ..

print_status "Todas las dependencias instaladas"

# Configurar backend
echo ""
echo "⚙️  Configurando backend..."
cd backend

# Crear .env si no existe
if [ ! -f .env ]; then
    cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/9citas?schema=public"
JWT_ACCESS_SECRET="super-secret-key-change-in-production-9citas-2024"
JWT_REFRESH_SECRET="super-refresh-key-change-in-production-9citas-2024"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
ADMIN_PASSWORD="admin123"
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
EOF
    print_status "Archivo .env del backend creado"
else
    print_warning "Archivo .env del backend ya existe"
fi

# Prisma
print_status "Generando cliente de Prisma..."
npx prisma generate --silent

print_status "Ejecutando migraciones de base de datos..."
npx prisma db push --accept-data-loss > /dev/null 2>&1

print_status "Generando perfiles falsos (esto puede tardar un minuto)..."
npm run db:seed > /dev/null 2>&1

# Crear carpeta uploads
mkdir -p uploads
print_status "Carpeta de uploads creada"

# Configurar frontend
echo ""
echo "⚙️  Configurando frontend..."
cd ../frontend

if [ ! -f .env ]; then
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
EOF
    print_status "Archivo .env del frontend creado"
else
    print_warning "Archivo .env del frontend ya existe"
fi

cd ..

# Resumen
echo ""
echo "======================================"
echo -e "${GREEN}✓ ¡Instalación completada!${NC}"
echo "======================================"
echo ""
echo "🌐 Para iniciar la aplicación:"
echo "   npm run dev"
echo ""
echo "📱 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Admin:    http://localhost:3000/admin"
echo ""
echo "🔐 Credenciales de admin:"
echo "   Password: admin123"
echo ""
echo "📚 Documentación:"
echo "   README.md - Documentación completa"
echo "   INSTALLATION.md - Guía de instalación"
echo "   TROUBLESHOOTING.md - Solución de problemas"
echo ""
echo "¡Disfruta de 9citas.com! 🎉"

