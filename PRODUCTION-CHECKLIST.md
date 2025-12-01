# ✅ Checklist de Producción - 9citas.com

## 🔐 Variables de Entorno

### Backend (Railway)
- [ ] `DATABASE_URL` - URL de PostgreSQL de Railway
- [ ] `JWT_ACCESS_SECRET` - Secreto para tokens de acceso
- [ ] `JWT_REFRESH_SECRET` - Secreto para tokens de refresh
- [ ] `JWT_ACCESS_EXPIRATION` - "15m"
- [ ] `JWT_REFRESH_EXPIRATION` - "7d"
- [ ] `PORT` - 4000
- [ ] `NODE_ENV` - "production"
- [ ] `FRONTEND_URL` - URLs del frontend separadas por comas (ej: "https://9citas.com,https://www.9citas.com")
- [ ] `OPENAI_API_KEY` - Clave de OpenAI para perfiles falsos (si aplica)

### Frontend (Vercel)
- [ ] `VITE_API_URL` - URL del backend en Railway (ej: "https://9citas-backend.up.railway.app/api")
- [ ] `VITE_SOCKET_URL` - URL del backend sin /api (ej: "https://9citas-backend.up.railway.app")

## 🗄️ Base de Datos

- [ ] Ejecutar migraciones: `npx prisma db push`
- [ ] Verificar que NO hay perfiles falsos: `npx tsx src/scripts/verify-production.ts`
- [ ] Eliminar perfiles falsos si existen: `npx tsx src/scripts/delete-all-fake-profiles.ts`
- [ ] Verificar usuarios específicos: `npx tsx src/scripts/list-all-users.ts`

## 🔒 Seguridad

- [ ] CORS configurado correctamente (verificar `backend/src/index.ts`)
- [ ] JWT secrets son únicos y seguros
- [ ] Variables de entorno NO están en el código
- [ ] `.env` está en `.gitignore`

## 🚀 Despliegue

### Backend (Railway)
- [ ] Proyecto conectado a GitHub
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npx prisma generate`
- [ ] Start Command: `npm start`
- [ ] Health check funciona: `https://tu-backend.railway.app/api/health`

### Frontend (Vercel)
- [ ] Proyecto conectado a GitHub
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Variables de entorno configuradas

## 🧪 Pruebas Post-Despliegue

- [ ] Login funciona
- [ ] Registro funciona
- [ ] Navegación de perfiles funciona
- [ ] Likes funcionan
- [ ] Chat funciona (WebSocket)
- [ ] 9Plus funciona
- [ ] Roam funciona
- [ ] Filtros funcionan
- [ ] PWA se puede instalar

## 📱 PWA

- [ ] `manifest.json` configurado
- [ ] Iconos PWA presentes (`APP.png`, `apple-touch-icon.png`)
- [ ] Service Worker funciona (si aplica)
- [ ] Instalación funciona en iOS y Android

## 🔍 Verificación Final

Ejecutar script de verificación:
```bash
cd backend
npx tsx src/scripts/verify-production.ts
```

Debería mostrar:
- ✅ Conexión a base de datos: OK
- ✅ Perfiles falsos: 0
- ✅ Variables de entorno: Configuradas
- ✅ Estado: LISTO PARA PRODUCCIÓN

## 🎯 Antes de Lanzar

- [ ] Probar en dispositivo móvil real
- [ ] Probar en diferentes navegadores
- [ ] Verificar que las fotos se cargan correctamente
- [ ] Verificar que los mensajes se envían en tiempo real
- [ ] Verificar que Stripe está conectado (cuando esté listo)
- [ ] Verificar que los pagos funcionan (cuando esté listo)

## 📝 Notas

- Los perfiles falsos están **completamente excluidos** de todas las consultas
- CORS está configurado para aceptar solo URLs del frontend
- Los usuarios solo ven perfiles de su orientación y género compatible
- Los usuarios free tienen limitaciones (50 perfiles, solo su ciudad, etc.)

