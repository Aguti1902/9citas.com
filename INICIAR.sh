#!/bin/bash

echo "🚀 INICIANDO 9CITAS.COM"
echo "======================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# PASO 1: Iniciar PostgreSQL directamente (sin brew services)
echo "1️⃣  Iniciando PostgreSQL..."
pg_ctl -D /opt/homebrew/var/postgresql@14 start > /tmp/postgres.log 2>&1 &
sleep 3

# Verificar
if pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL corriendo${NC}"
else
    echo -e "${YELLOW}⚠️  Método alternativo...${NC}"
    /opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14 > /tmp/postgres.log 2>&1 &
    sleep 3
fi

if ! pg_isready > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL no se pudo iniciar${NC}"
    echo "Ejecuta manualmente en otra terminal:"
    echo "  postgres -D /opt/homebrew/var/postgresql@14"
    exit 1
fi

# PASO 2: Crear base de datos
echo ""
echo "2️⃣  Configurando base de datos..."
dropdb 9citas 2>/dev/null
createdb 9citas 2>/dev/null
echo -e "${GREEN}✅ Base de datos creada${NC}"

# PASO 3: Verificar dependencias
echo ""
echo "3️⃣  Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias raíz..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Instalando dependencias backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Instalando dependencias frontend..."
    cd frontend && npm install && cd ..
fi
echo -e "${GREEN}✅ Dependencias listas${NC}"

# PASO 4: Configurar backend
echo ""
echo "4️⃣  Configurando backend..."
cd backend
npx prisma generate > /dev/null 2>&1
npx prisma db push --accept-data-loss > /dev/null 2>&1
echo "Generando perfiles falsos (puede tardar 1-2 minutos)..."
npm run db:seed > /dev/null 2>&1
mkdir -p uploads
cd ..
echo -e "${GREEN}✅ Backend configurado${NC}"

# PASO 5: Limpiar puertos
echo ""
echo "5️⃣  Limpiando puertos..."
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Puertos liberados${NC}"

# PASO 6: Iniciar aplicación
echo ""
echo "======================================"
echo -e "${GREEN}✅ TODO LISTO - INICIANDO APP${NC}"
echo "======================================"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Admin:    http://localhost:3000/admin"
echo ""
echo "⏳ Esperando a que inicie..."
echo "   (Cuando veas 'Local: http://localhost:3000' abre el navegador)"
echo ""
echo "🛑 Para detener: Ctrl+C"
echo ""

npm run dev
