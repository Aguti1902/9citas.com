# 🔧 Solución de Problemas - 9citas.com

## Diagnóstico Rápido

### 1️⃣ ¿Qué error estás viendo?

Marca cuál de estos problemas tienes:

- [ ] No puedo instalar las dependencias
- [ ] Error al iniciar el backend
- [ ] Error al iniciar el frontend
- [ ] Error de conexión a la base de datos
- [ ] La página no carga
- [ ] Otro error (especifica cuál)

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Cannot find module" o dependencias faltantes

```bash
# Limpia todo y reinstala
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS

# Eliminar node_modules y lockfiles
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Reinstalar
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Error: "Port already in use" (Puerto ocupado)

```bash
# Matar procesos en puertos 3000 y 4000
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# Verificar que están libres
lsof -i:3000
lsof -i:4000
```

### Error: PostgreSQL no conecta

```bash
# Verificar si PostgreSQL está corriendo
psql --version
pg_isready

# Iniciar PostgreSQL (macOS)
brew services start postgresql@14
# O
pg_ctl -D /usr/local/var/postgres start

# Crear la base de datos
createdb 9citas

# Probar conexión
psql -U postgres -d 9citas -c "SELECT version();"
```

### Error: Prisma no encuentra el schema

```bash
cd backend

# Generar cliente de Prisma
npx prisma generate

# Crear/actualizar base de datos
npx prisma db push

# O hacer migración
npx prisma migrate dev --name init

# Seed (solo después de migrar)
npm run db:seed
```

---

## 📋 Checklist de Instalación Completa

Ejecuta estos comandos EN ORDEN:

```bash
# 1. Ir a la carpeta del proyecto
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS

# 2. Verificar que PostgreSQL está corriendo
psql --version

# 3. Crear base de datos (si no existe)
createdb 9citas

# 4. Instalar dependencias raíz
npm install

# 5. Instalar dependencias backend
cd backend
npm install

# 6. Crear archivo .env del backend (IMPORTANTE)
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/9citas?schema=public"
JWT_ACCESS_SECRET="super-secret-key-change-in-production-9citas"
JWT_REFRESH_SECRET="super-refresh-key-change-in-production-9citas"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
ADMIN_PASSWORD="admin123"
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
EOF

# 7. Generar Prisma
npx prisma generate

# 8. Ejecutar migraciones
npx prisma db push

# 9. Seed de datos (perfiles falsos)
npm run db:seed

# 10. Crear carpeta uploads
mkdir -p uploads

# 11. Instalar dependencias frontend
cd ../frontend
npm install

# 12. Crear archivo .env del frontend
cat > .env << 'EOF'
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
EOF

# 13. Volver a la raíz y ejecutar
cd ..
npm run dev
```

---

## 🔍 Verificación Manual

### Verificar archivos .env existen

```bash
# Desde la raíz del proyecto
ls -la backend/.env
ls -la frontend/.env
```

Ambos archivos deben existir.

### Verificar PostgreSQL

```bash
# Debe mostrar la versión
psql --version

# Debe mostrar "accepting connections"
pg_isready

# Debe listar tu base de datos 9citas
psql -U postgres -l | grep 9citas
```

### Verificar estructura de carpetas

```bash
# Desde la raíz
tree -L 2 -I 'node_modules'
```

---

## 🐛 Errores Específicos

### "Error: connect ECONNREFUSED"

**Causa:** PostgreSQL no está corriendo o credenciales incorrectas.

**Solución:**
```bash
# Iniciar PostgreSQL
brew services start postgresql@14

# Verificar usuario y contraseña en backend/.env
# Cambiar DATABASE_URL si tu usuario no es "postgres"
```

### "Prisma Client not generated"

```bash
cd backend
npx prisma generate
```

### "Cannot read properties of undefined"

**Causa:** Probablemente el backend no está respondiendo.

**Solución:**
```bash
# Verificar que el backend está corriendo
curl http://localhost:4000/api/health

# Debe responder: {"status":"ok","message":"9citas API is running"}
```

### Frontend muestra pantalla en blanco

1. Abre la consola del navegador (F12)
2. Ve a la pestaña Console
3. Copia y pega el error que aparece

---

## 📝 Recopilación de Información para Debug

Si ninguna solución funciona, ejecuta esto y envíame la salida:

```bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS

echo "=== VERSIONES ==="
node --version
npm --version
psql --version

echo "=== ARCHIVOS .ENV ==="
echo "Backend .env existe:"
test -f backend/.env && echo "SÍ" || echo "NO"
echo "Frontend .env existe:"
test -f frontend/.env && echo "SÍ" || echo "NO"

echo "=== POSTGRESQL ==="
pg_isready

echo "=== BASE DE DATOS ==="
psql -U postgres -l | grep 9citas

echo "=== PUERTOS ==="
lsof -i:3000
lsof -i:4000

echo "=== DEPENDENCIAS ==="
cd backend && npm list --depth=0
cd ../frontend && npm list --depth=0
```

---

## 🚀 Script de Reset Total

Si todo falla, este script limpia y reinstala todo:

```bash
#!/bin/bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS

echo "🧹 Limpiando todo..."
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json backend/dist
rm -rf frontend/node_modules frontend/package-lock.json frontend/dist

echo "📦 Instalando dependencias..."
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

echo "🗄️ Reseteando base de datos..."
cd backend
npx prisma generate
npx prisma db push --force-reset
npm run db:seed
mkdir -p uploads

echo "✅ Todo listo. Ejecuta: npm run dev"
```

Guarda esto en `reset.sh`, dale permisos y ejecútalo:
```bash
chmod +x reset.sh
./reset.sh
```

---

## 💬 Ayuda Adicional

**Dime exactamente:**
1. ¿Qué comando ejecutaste?
2. ¿Qué error específico te apareció?
3. ¿En qué paso del proceso estás?

Con esa información puedo darte una solución precisa.

