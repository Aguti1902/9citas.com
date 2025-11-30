# 🚀 Configuración de Vercel para 9citas.com

## ⚠️ IMPORTANTE: Desplegar Frontend y Backend por separado

Vercel funciona mejor cuando despliegas el frontend y backend como proyectos separados.

---

## 📱 FRONTEND - Configuración en Vercel

### 1. Crear nuevo proyecto en Vercel

1. Ve a https://vercel.com/new
2. Selecciona tu repositorio: `Aguti1902/9citas.com`
3. Click en **"Import"**

### 2. Configuración del proyecto

**General Settings:**
- **Project Name**: `9citas-frontend` (o el que prefieras)
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend` ⚠️ **MUY IMPORTANTE**

**Build & Development Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Variables de entorno

Ve a **Settings → Environment Variables** y añade:

```
VITE_API_URL = https://tu-backend-url.railway.app
```

⚠️ **Nota**: Primero despliega el backend (ver abajo) para obtener esta URL.

### 4. Deploy

Click en **"Deploy"** y espera a que termine.

Tu frontend estará disponible en: `https://9citas-frontend.vercel.app`

---

## 🔧 BACKEND - Desplegar en Railway (Recomendado)

Vercel tiene limitaciones para backends con WebSockets y Node.js (timeout de 10s).
**Railway es mejor para el backend de 9citas.**

### 1. Crear proyecto en Railway

1. Ve a https://railway.app
2. Login con GitHub
3. Click **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Elige `Aguti1902/9citas.com`

### 2. Configuración

**Service Settings:**
- **Root Directory**: `backend`
- **Build Command**: (automático)
- **Start Command**: `npm start`

### 3. Añadir PostgreSQL

1. En tu proyecto de Railway, click **"New"**
2. Selecciona **"Database" → "PostgreSQL"**
3. Railway creará automáticamente la variable `DATABASE_URL`

### 4. Variables de entorno

Ve a **Variables** y añade:

```
DATABASE_URL = (Railway lo crea automáticamente)
JWT_SECRET = tu_secreto_jwt_super_seguro_123456
JWT_REFRESH_SECRET = tu_secreto_refresh_jwt_super_seguro_789
NODE_ENV = production
PORT = 4000
```

### 5. Migrar la base de datos

Desde tu terminal local:

```bash
cd backend

# Copiar la DATABASE_URL de Railway
export DATABASE_URL="postgresql://postgres:..."

# Aplicar schema
npx prisma db push

# Crear datos de prueba (200-400 perfiles falsos)
npx prisma db seed
```

### 6. Obtener URL del backend

Railway te dará una URL como:
```
https://9citas-backend-production.up.railway.app
```

**Copia esta URL** y úsala como `VITE_API_URL` en Vercel (frontend).

---

## 🔄 Conectar Frontend con Backend

1. Ve a tu proyecto frontend en Vercel
2. **Settings → Environment Variables**
3. Edita `VITE_API_URL`:
   ```
   VITE_API_URL = https://9citas-backend-production.up.railway.app
   ```
4. Ve a **Deployments** → Click en los 3 puntos del último deploy → **"Redeploy"**

---

## ✅ Verificación

### Frontend (Vercel):
- ✅ Abre `https://9citas-frontend.vercel.app`
- ✅ Deberías ver la página de inicio con el logo
- ✅ Intenta registrarte

### Backend (Railway):
- ✅ Abre `https://tu-backend.railway.app/api/auth/health` (si tienes una ruta de health)
- ✅ Debería responder con 200 OK

### Conexión:
- ✅ El registro debería funcionar
- ✅ El login debería funcionar
- ✅ Deberías poder ver perfiles

---

## 🐛 Troubleshooting

### Error: "Network Error" al registrarse

**Problema**: El frontend no puede conectarse al backend.

**Solución**:
1. Verifica que `VITE_API_URL` esté correcta en Vercel
2. Verifica que el backend esté corriendo en Railway
3. Verifica que el backend permita CORS desde tu dominio de Vercel

En `backend/src/index.ts`, asegúrate de tener:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://9citas-frontend.vercel.app', // Tu dominio de Vercel
  ],
  credentials: true,
}))
```

### Error: "Cannot connect to database"

**Problema**: El backend no puede conectarse a PostgreSQL.

**Solución**:
1. Verifica que `DATABASE_URL` esté correcta en Railway
2. Verifica que la base de datos esté corriendo
3. Ejecuta `npx prisma db push` desde tu local con la `DATABASE_URL` de producción

### Error: "JWT malformed"

**Problema**: Los secretos JWT no están configurados.

**Solución**:
1. Verifica que `JWT_SECRET` y `JWT_REFRESH_SECRET` estén en Railway
2. Redeploy el backend

---

## 📱 Dominio Personalizado (Opcional)

### En Vercel (Frontend):

1. Ve a tu proyecto → **Settings → Domains**
2. Click **"Add Domain"**
3. Ingresa: `9citas.com` y `www.9citas.com`
4. Sigue las instrucciones para configurar los DNS

### Registrar dominio:

- **Namecheap**: https://www.namecheap.com (~10€/año)
- **GoDaddy**: https://www.godaddy.com
- **Google Domains**: https://domains.google

---

## 🎉 ¡Listo!

Tu aplicación 9citas.com está ahora en producción:

- **Frontend**: https://9citas-frontend.vercel.app
- **Backend**: https://9citas-backend.railway.app
- **Repositorio**: https://github.com/Aguti1902/9citas.com

---

## 📝 Próximos pasos

1. ✅ Configurar dominio personalizado (9citas.com)
2. ✅ Configurar emails reales (SendGrid, Mailgun)
3. ✅ Configurar pagos con Stripe para 9Plus y Roam
4. ✅ Configurar analytics (Google Analytics)
5. ✅ Configurar error tracking (Sentry)
6. ✅ Configurar backups automáticos de la DB
7. ✅ Configurar CDN para las fotos (Cloudinary, AWS S3)

---

**¿Necesitas ayuda?** Contacta al desarrollador o abre un issue en GitHub.

