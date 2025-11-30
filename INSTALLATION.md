# Guía de Instalación Rápida - 9citas.com

Esta guía te ayudará a poner en marcha 9citas.com en tu entorno local en menos de 10 minutos.

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) versión 18 o superior
- [PostgreSQL](https://www.postgresql.org/) versión 14 o superior
- npm (viene con Node.js)

## 🚀 Instalación Paso a Paso

### 1. Preparar PostgreSQL

Abre tu terminal y ejecuta:

```bash
# Crear la base de datos
createdb 9citas

# Verificar que PostgreSQL está corriendo
psql -U postgres -c "SELECT version();"
```

Si no tienes usuario postgres, usa tu usuario de PostgreSQL.

### 2. Instalar Dependencias

Desde la carpeta raíz del proyecto:

```bash
npm run install:all
```

Este comando instalará todas las dependencias del proyecto (raíz, backend y frontend).

### 3. Configurar Backend

```bash
# Copiar el archivo de ejemplo
cd backend
cp .env.example .env
```

Edita el archivo `backend/.env` y ajusta la conexión a tu base de datos:

```env
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/9citas?schema=public"
```

Reemplaza `TU_USUARIO` y `TU_PASSWORD` con tus credenciales de PostgreSQL.

### 4. Configurar Frontend

```bash
# Copiar el archivo de ejemplo
cd ../frontend
cp .env.example .env
```

El archivo `frontend/.env` por defecto ya está configurado correctamente:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### 5. Crear Estructura de Base de Datos

```bash
cd ../backend
npm run db:generate
npm run db:migrate
```

### 6. Generar Datos de Prueba

Esto creará entre 200-400 perfiles falsos:

```bash
npm run db:seed
```

### 7. Crear Carpeta de Uploads

```bash
mkdir uploads
```

### 8. ¡Lanzar la Aplicación!

Desde la raíz del proyecto:

```bash
cd ..
npm run dev
```

Este comando iniciará tanto el backend como el frontend simultáneamente.

## 🎉 ¡Listo!

La aplicación estará disponible en:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Panel Admin**: http://localhost:3000/admin

## 🧪 Primer Uso

1. Ve a http://localhost:3000
2. Selecciona tu orientación (Hetero o Gay)
3. Regístrate con un email y contraseña
4. Completa tu perfil
5. ¡Empieza a explorar!

## 🔐 Acceso al Panel Admin

- URL: http://localhost:3000/admin
- Contraseña por defecto: `admin123`

## ❓ Problemas Comunes

### PostgreSQL no se conecta

```bash
# Verificar que está corriendo
sudo service postgresql status

# Iniciarlo si está detenido
sudo service postgresql start
```

### Puerto ocupado

```bash
# Liberar puerto 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Liberar puerto 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Error en migraciones

```bash
cd backend
npx prisma migrate reset
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 📚 Siguiente Paso

Lee el [README.md](README.md) completo para más información sobre funcionalidades y configuración avanzada.

---

**¿Necesitas ayuda?** Revisa los logs en la terminal donde ejecutaste `npm run dev`.

