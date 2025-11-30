#!/bin/bash

# Script para solucionar problemas de PostgreSQL en macOS
echo "🔧 Solucionando PostgreSQL..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Paso 1: Detener cualquier proceso de PostgreSQL
echo "1. Deteniendo procesos de PostgreSQL..."
brew services stop postgresql@14 2>/dev/null
killall postgres 2>/dev/null
sleep 2
print_status "Procesos detenidos"

# Paso 2: Limpiar archivos de bloqueo
echo ""
echo "2. Limpiando archivos de bloqueo..."
rm -f /usr/local/var/postgresql@14/postmaster.pid 2>/dev/null
rm -f /usr/local/var/postgres/postmaster.pid 2>/dev/null
print_status "Archivos de bloqueo eliminados"

# Paso 3: Iniciar PostgreSQL directamente
echo ""
echo "3. Iniciando PostgreSQL directamente..."
pg_ctl -D /usr/local/var/postgresql@14 start 2>/dev/null || \
pg_ctl -D /usr/local/var/postgres start 2>/dev/null || \
postgres -D /usr/local/var/postgresql@14 > /dev/null 2>&1 &

sleep 3

# Verificar si está corriendo
if pg_isready > /dev/null 2>&1; then
    print_status "PostgreSQL está corriendo ahora"
    echo ""
    echo "======================================"
    echo -e "${GREEN}✓ PostgreSQL funcionando correctamente${NC}"
    echo "======================================"
    exit 0
else
    print_error "No se pudo iniciar PostgreSQL con métodos normales"
    echo ""
    echo "Intentando método alternativo..."
fi

# Paso 4: Método alternativo - iniciar como proceso
echo ""
echo "4. Iniciando PostgreSQL como proceso..."
/usr/local/opt/postgresql@14/bin/postgres -D /usr/local/var/postgresql@14 > /dev/null 2>&1 &
sleep 3

if pg_isready > /dev/null 2>&1; then
    print_status "PostgreSQL está corriendo"
    exit 0
fi

# Si todo falla, mostrar instrucciones manuales
echo ""
print_error "No se pudo iniciar PostgreSQL automáticamente"
echo ""
echo "======================================"
echo "SOLUCIÓN MANUAL:"
echo "======================================"
echo ""
echo "Ejecuta UNO de estos comandos:"
echo ""
echo "Opción 1 (Recomendado):"
echo "  pg_ctl -D /usr/local/var/postgresql@14 start"
echo ""
echo "Opción 2:"
echo "  postgres -D /usr/local/var/postgresql@14"
echo "  (Mantén esta terminal abierta)"
echo ""
echo "Opción 3:"
echo "  brew services restart postgresql@14"
echo ""
echo "Luego verifica con:"
echo "  pg_isready"
echo ""

