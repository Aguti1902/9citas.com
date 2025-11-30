# 🚀 Guía de Despliegue - 9citas.com

## ✅ Estado Actual

- ✅ Git inicializado
- ✅ Archivos añadidos y commiteados
- ✅ Rama `main` creada
- ✅ Remoto de GitHub configurado
- ⏳ **Falta**: Push a GitHub (requiere autenticación)

---

## 📤 Paso 1: Subir a GitHub

### Opción A: Usando GitHub CLI (recomendado)

```bash
# Instalar GitHub CLI si no lo tienes
brew install gh

# Autenticarte
gh auth login

# Push
cd "/Users/guti/Desktop/CURSOR WEBS/9CITAS"
git push -u origin main
```

### Opción B: Usando Token de Acceso Personal

1. Ve a GitHub: https://github.com/settings/tokens
2. Click en "Generate new token (classic)"
3. Selecciona scopes: `repo` (todos)
4. Copia el token generado

```bash
cd "/Users/guti/Desktop/CURSOR WEBS/9CITAS"

# Usar el token como contraseña
git push -u origin main
# Username: Aguti1902
# Password: [PEGA TU TOKEN AQUÍ]
```

### Opción C: Usando SSH (más seguro)

```bash
# Generar clave SSH si no tienes
ssh-keygen -t ed25519 -C "tu_email@ejemplo.com"

# Copiar la clave pública
cat ~/.ssh/id_ed25519.pub

# Añadir en GitHub: https://github.com/settings/keys
# Click "New SSH key" y pega la clave

# Cambiar remoto a SSH
cd "/Users/guti/Desktop/CURSOR WEBS/9CITAS"
git remote set-url origin git@github.com:Aguti1902/9citas.com.git

# Push
git push -u origin main
```

---

## 🌐 Paso 2: Desplegar Frontend en Vercel

### 2.1 Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login en Vercel

```bash
vercel login
```

### 2.3 Desplegar Frontend

```bash
cd "/Users/guti/Desktop/CURSOR WEBS/9CITAS/frontend"
vercel --prod
```

**Configuración durante el deploy:**
- Set up and deploy? → **Yes**
- Which scope? → Tu cuenta personal
- Link to existing project? → **No**
- Project name? → `9citas-frontend` (o el que prefieras)
- In which directory is your code located? → `./`
- Want to override settings? → **Yes**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### 2.4 Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel Dashboard → Settings → Environment Variables

Añade:
```
VITE_API_URL = https://tu-backend-url.vercel.app
```

Redeploy después de añadir las variables.

---

## 🔧 Paso 3: Desplegar Backend

### Opción A: Vercel (Serverless)

```bash
cd "/Users/guti/Desktop/CURSOR WEBS/9CITAS/backend"
vercel --prod
```

**Variables de entorno en Vercel:**
```
DATABASE_URL = postgresql://usuario:password@host:5432/database
JWT_SECRET = tu_secreto_jwt_super_seguro
JWT_REFRESH_SECRET = tu_secreto_refresh_super_seguro
NODE_ENV = production
```

⚠️ **Nota**: Vercel tiene limitaciones para Node.js (10s timeout). Para funcionalidades en tiempo real (chat), considera Railway u otra opción.

### Opción B: Railway (Recomendado para backend con WebSockets)

1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Selecciona `9citas.com`
5. Selecciona la carpeta `backend`

**Variables de entorno en Railway:**
```
DATABASE_URL = postgresql://...  (Railway te da una DB gratis)
JWT_SECRET = tu_secreto_jwt
JWT_REFRESH_SECRET = tu_secreto_refresh
PORT = 4000
NODE_ENV = production
```

6. Railway te dará una URL como: `https://9citas-backend.up.railway.app`

### Opción C: Render.com

1. Ve a https://render.com
2. New → Web Service
3. Conecta tu repo de GitHub
4. Root Directory: `backend`
5. Build Command: `npm install && npx prisma generate`
6. Start Command: `npm start`

**Variables de entorno:**
```
DATABASE_URL = postgresql://...
JWT_SECRET = tu_secreto
JWT_REFRESH_SECRET = tu_secreto_refresh
NODE_ENV = production
```

---

## 🗄️ Paso 4: Base de Datos PostgreSQL en Producción

### Opción A: Railway (Gratis - 500MB)

1. En tu proyecto de Railway
2. Click "New" → "Database" → "Add PostgreSQL"
3. Copia la `DATABASE_URL` que te da
4. Pégala en las variables de entorno del backend

### Opción B: Supabase (Gratis - 500MB)

1. Ve a https://supabase.com
2. New Project
3. Copia la Connection String (modo "Session")
4. Formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Opción C: Neon (Gratis - 3GB)

1. Ve a https://neon.tech
2. Create Project
3. Copia la Connection String
4. Úsala como `DATABASE_URL`

### Migrar la base de datos

```bash
cd backend

# Configurar DATABASE_URL de producción
export DATABASE_URL="postgresql://..."

# Aplicar schema
npx prisma db push

# Seed (opcional - para datos de prueba)
npx prisma db seed
```

---

## 🔗 Paso 5: Conectar Frontend con Backend

1. Ve a Vercel Dashboard → Tu proyecto frontend
2. Settings → Environment Variables
3. Edita `VITE_API_URL`:
   ```
   VITE_API_URL = https://tu-backend-url.railway.app
   ```
4. Redeploy el frontend

---

## ✅ Verificación Final

### Checklist:

- [ ] Código subido a GitHub
- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado (Railway/Render/Vercel)
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas
- [ ] Frontend conectado al backend
- [ ] Seed ejecutado (perfiles de prueba)
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Chat funciona
- [ ] Upload de fotos funciona

### URLs Finales:

```
Frontend: https://9citas-frontend.vercel.app
Backend:  https://9citas-backend.railway.app
Repo:     https://github.com/Aguti1902/9citas.com
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de que la IP de tu servidor esté permitida en el firewall de la DB

### Error: "JWT malformed"
- Verifica que `JWT_SECRET` y `JWT_REFRESH_SECRET` estén configurados

### Error: "CORS policy"
- Añade la URL del frontend a la lista de orígenes permitidos en `backend/src/index.ts`

### Error: "Module not found"
- Ejecuta `npm install` y `npx prisma generate` en el backend

---

## 📱 Dominio Personalizado (Opcional)

### En Vercel:

1. Ve a tu proyecto → Settings → Domains
2. Add Domain: `9citas.com`
3. Configura los DNS según las instrucciones de Vercel

### Registrar dominio:

- Namecheap: https://www.namecheap.com
- GoDaddy: https://www.godaddy.com
- Google Domains: https://domains.google

---

## 🎉 ¡Listo!

Tu app 9citas.com está ahora en producción y accesible desde cualquier lugar del mundo.

**Próximos pasos:**
- Configurar analytics (Google Analytics, Plausible)
- Configurar error tracking (Sentry)
- Configurar emails reales (SendGrid, Mailgun)
- Configurar pagos (Stripe)
- Configurar backups automáticos de la DB

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al desarrollador.

