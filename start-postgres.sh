#!/bin/bash

echo "🐘 Iniciando PostgreSQL..."

# Para Mac con Apple Silicon (M1/M2)
pg_ctl -D /opt/homebrew/var/postgresql@14 start

sleep 2

# Verificar
if pg_isready > /dev/null 2>&1; then
    echo "✅ PostgreSQL está corriendo correctamente"
    echo ""
    echo "Ahora ejecuta: ./install-and-run.sh"
else
    echo "⚠️  Intentando método alternativo..."
    /opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14 &
    sleep 3
    if pg_isready > /dev/null 2>&1; then
        echo "✅ PostgreSQL está corriendo"
    else
        echo "❌ No se pudo iniciar PostgreSQL"
        echo ""
        echo "Intenta manualmente:"
        echo "  brew services start postgresql@14"
    fi
fi
