# 🚀 Guía Simplificada: Migrar a Hostinger con Railway (Base de Datos)

Esta guía está pensada para **no programadores**. Te guiará paso a paso para:
1. ✅ Pasar todo el código de GitHub al servidor
2. ✅ Conectar con Railway como base de datos (ya la tienes funcionando)
3. ✅ Conectar el dominio 9citas.com

---

## 📋 Lo que ya tienes hecho ✅

- ✅ Código clonado en `~/9citas.com`
- ✅ PostgreSQL instalado (aunque no lo usaremos, está bien)
- ✅ Base de datos funcionando en Railway

---

## 🔧 Paso 1: Instalar Node.js

En la terminal de Hostinger, ejecuta:

```bash
# Instalar Node.js 18
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verificar que funciona
node --version
npm --version
```

---

## 🔧 Paso 2: Instalar herramientas necesarias

```bash
# Instalar PM2 (para mantener el servidor corriendo)
npm install -g pm2

# Instalar Nginx (servidor web)
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Backend - Crear archivo `.env`

```bash
cd ~/9citas.com/backend
nano .env
```

**Copia y pega esto (y cambia los valores):**

```env
# Base de datos Railway (de Railway)
# ⚠️ IMPORTANTE: Usa la URL EXTERNA, no la interna (.railway.internal)
# Obtén la URL externa en Railway → PostgreSQL → Connect → Public Network
DATABASE_URL="postgresql://postgres:lPKzXGDXgdcQqXFYmirvfDkyVWDYvNPy@shortline.proxy.rlwy.net:43947/railway"

# JWT Secrets (de Railway)
JWT_SECRET="9citas_jwt_secret_super_seguro_production_2024"
JWT_REFRESH_SECRET="9citas_refresh_jwt_secret_super_seguro_production_2024"

# IMPORTANTE: Genera JWT_ACCESS_SECRET nuevo (ejecuta: openssl rand -base64 32)
JWT_ACCESS_SECRET="NGwhEqUIWmY46L+GuIXxFjRbBHKGSDcSu00TYkFLNg4="

# Puerto del servidor
PORT=5000

# CORS - Tu dominio
CORS_ORIGIN=https://9citas.com
FRONTEND_URL=https://9citas.com

# Email (SMTP) - Los mismos que usas en Railway
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password_gmail
REPORTS_EMAIL=denuncias@9citas.com

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=6LfNiSUsAAAAAFvWXJ1dLuemBAIyw7Z8AzapAAXC

# Cloudinary (de Railway - ya están tus datos)
CLOUDINARY_CLOUD_NAME="dmrdydsjv"
CLOUDINARY_API_KEY="957942125576369"
CLOUDINARY_API_SECRET="kJWwXcg0x0MTfNq3ux4nXE_RMVw"

# Admin - CREA UNA CONTRASEÑA SEGURA AQUÍ
ADMIN_PASSWORD=9CITAS2025

# Entorno
NODE_ENV=production
```

**Para guardar en nano:** Presiona `Ctrl + X`, luego `Y`, luego `Enter`

### 3.2 Frontend - Crear archivo `.env.production`

```bash
cd ~/9citas.com/frontend
nano .env.production
```

**Copia y pega esto:**

```env
VITE_API_URL=https://api.9citas.com
VITE_SOCKET_URL=https://api.9citas.com
VITE_RECAPTCHA_SITE_KEY=6LfNiSUsAAAAAJ1X4PbLa4jN4TMg2uX8u7DuPQt7
```

**Para guardar:** `Ctrl + X`, luego `Y`, luego `Enter`

---

## 🏗️ Paso 4: Compilar Backend

```bash
cd ~/9citas.com/backend

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Generar Prisma (conectar con Railway)
npx prisma generate
npx prisma db push
```

---

## 🎨 Paso 5: Compilar Frontend

```bash
cd ~/9citas.com/frontend

# Instalar dependencias
npm install

# Compilar para producción
npm run build
```

Esto creará una carpeta `dist/` con los archivos listos.

---

## 🚀 Paso 6: Iniciar Backend con PM2

```bash
cd ~/9citas.com/backend

# Iniciar el servidor
pm2 start ecosystem.config.js

# Guardar configuración para que se inicie automáticamente
pm2 save
pm2 startup
```

**Verificar que funciona:**
```bash
pm2 status
pm2 logs 9citas-backend
```

---

## 🌐 Paso 7: Configurar Nginx

### 7.1 Configuración para API (Backend)

```bash
nano /etc/nginx/sites-available/9citas-api
```

**Copia y pega esto:**

```nginx
server {
    listen 80;
    server_name api.9citas.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    client_max_body_size 10M;
}
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

### 7.2 Configuración para Frontend

```bash
nano /etc/nginx/sites-available/9citas-frontend
```

**Copia y pega esto:**

```nginx
server {
    listen 80;
    server_name 9citas.com www.9citas.com;

    root /root/9citas.com/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

### 7.3 Activar las configuraciones

```bash
# Crear enlaces simbólicos
ln -s /etc/nginx/sites-available/9citas-api /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/

# Verificar que no hay errores
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

---

## 🔒 Paso 8: Configurar SSL (Certificado HTTPS)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado para el frontend
certbot --nginx -d 9citas.com -d www.9citas.com

# Obtener certificado para la API
certbot --nginx -d api.9citas.com
```

Certbot te hará algunas preguntas:
- **Email:** Pon cualquier email válido que uses (ejemplo: `tu-email@gmail.com`). 
  - Este email se usa SOLO para notificaciones sobre la renovación del certificado SSL
  - Puede ser tu email personal o el que uses para administrar el sitio
  - No tiene que ser un email relacionado con el dominio 9citas.com
- **Términos:** Acepta (Y)
- **Compartir email:** Puedes decir No (N)
- **Redirigir HTTP a HTTPS:** Sí (2)

---

## 🌍 Paso 9: Configurar DNS en Hostinger

### 9.1 Configurar registros DNS

En el panel de Hostinger:

1. Ve a **"Administrador de DNS"** o **"DNS Manager"**
2. Añade estos registros:

**Para el frontend (9citas.com):**
- **Tipo:** A
- **Nombre:** @ (o 9citas.com)
- **Valor:** `72.62.21.204` (tu IP del VPS)
- **TTL:** 3600

**Para www.9citas.com:**
- **Tipo:** A
- **Nombre:** www
- **Valor:** `72.62.21.204`
- **TTL:** 3600

**Para la API (api.9citas.com):**
- **Tipo:** A
- **Nombre:** api
- **Valor:** `72.62.21.204`
- **TTL:** 3600

### 9.2 Esperar propagación DNS

Los cambios DNS pueden tardar entre 5 minutos y 24 horas. Normalmente funciona en 10-30 minutos.

---

## ✅ Paso 10: Verificar que Todo Funciona

### 10.1 Verificar Backend

```bash
# Ver logs
pm2 logs 9citas-backend

# Ver estado
pm2 status
```

### 10.2 Verificar Frontend

```bash
# Verificar que los archivos están
ls -la ~/9citas.com/frontend/dist
```

### 10.3 Probar en el navegador

1. Espera 10-30 minutos después de configurar DNS
2. Abre en tu navegador: `https://9citas.com`
3. Debería cargar tu aplicación

---

## 🔄 Actualizar el Código en el Futuro

Cuando quieras actualizar el código:

```bash
cd ~/9citas.com

# Descargar cambios de GitHub
git pull origin main

# Backend
cd backend
npm install
npm run build
pm2 restart 9citas-backend

# Frontend
cd ../frontend
npm install
npm run build
# Nginx servirá automáticamente los nuevos archivos
```

---

## 🆘 Problemas Comunes

### El sitio no carga

1. Verifica DNS: `ping 9citas.com` (debe mostrar tu IP)
2. Verifica Nginx: `systemctl status nginx`
3. Verifica PM2: `pm2 status`
4. Ver logs: `pm2 logs 9citas-backend`

### Error de conexión a base de datos

1. Verifica que la URL de Railway en `.env` es correcta
2. Verifica que Railway está funcionando
3. Prueba: `cd ~/9citas.com/backend && npx prisma db push`

### Puerto 5000 no funciona

```bash
# Verificar que el puerto está abierto
netstat -tulpn | grep 5000

# Si no aparece, reinicia PM2
pm2 restart 9citas-backend
```

---

## 📝 Resumen de URLs

- **Frontend:** https://9citas.com
- **API:** https://api.9citas.com
- **IP del servidor:** 72.62.21.204

---

## 🎯 Checklist Final

- [ ] Node.js instalado
- [ ] PM2 instalado
- [ ] Nginx instalado
- [ ] Variables de entorno configuradas (backend y frontend)
- [ ] Backend compilado y corriendo con PM2
- [ ] Frontend compilado
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] DNS configurado en Hostinger
- [ ] Todo funcionando en https://9citas.com

---

¡Listo! Tu aplicación debería estar funcionando en https://9citas.com 🚀

