#!/bin/bash

echo "🚀 Iniciando 9citas.com..."
echo "================================"

# Asegurar que PostgreSQL está corriendo
echo "✓ Verificando PostgreSQL..."
pg_ctl -D /opt/homebrew/var/postgresql@14 status > /dev/null 2>&1 || {
    echo "⚠️  PostgreSQL no está corriendo, iniciándolo..."
    pg_ctl -D /opt/homebrew/var/postgresql@14 start
    sleep 3
}

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Limpiar procesos anteriores
echo "✓ Limpiando procesos anteriores..."
pkill -f "tsx.*9CITAS" 2>/dev/null
pkill -f "vite.*9CITAS" 2>/dev/null
sleep 2

# Generar Prisma Client
echo "✓ Generando Prisma Client..."
cd backend && npx prisma generate > /dev/null 2>&1
cd ..

echo ""
echo "================================"
echo "ABRIENDO TERMINALES..."
echo "================================"
echo ""
echo "🔧 BACKEND: Se abrirá en una terminal nueva"
echo "🎨 FRONTEND: Se abrirá en otra terminal"
echo ""
echo "URLs:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:4000"
echo ""

# Abrir terminal para backend
osascript <<EOF
tell application "Terminal"
    do script "cd '$PWD/backend' && echo '🔧 Iniciando BACKEND...' && npm run dev"
    activate
end tell
EOF

sleep 2

# Abrir terminal para frontend
osascript <<EOF
tell application "Terminal"
    do script "cd '$PWD/frontend' && echo '🎨 Iniciando FRONTEND...' && npm run dev"
    activate
end tell
EOF

echo "✅ Terminales abiertas!"
echo ""
echo "Espera unos segundos a que inicien los servicios."
echo "Luego abre http://localhost:3000 en tu navegador."

