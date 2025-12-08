# 🚀 Guía de Migración a Hostinger

Esta guía te ayudará a migrar tu proyecto 9citas.com a Hostinger, incluyendo la base de datos PostgreSQL.

## 📋 Requisitos Previos

- ✅ VPS de Hostinger configurado
- ✅ Dominio apuntando al servidor
- ✅ Acceso SSH al servidor
- ✅ Base de datos PostgreSQL creada en Hostinger

---

## 🔧 Paso 1: Preparar el Servidor VPS

### 1.1 Conectarse al servidor

```bash
ssh root@TU_IP_SERVIDOR
# o
ssh root@9citas.com
```

### 1.2 Actualizar el sistema

```bash
apt update && apt upgrade -y
```

### 1.3 Instalar Node.js 18+

```bash
# Instalar Node.js usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18

# Verificar instalación
node --version
npm --version
```

### 1.4 Instalar PostgreSQL (si no está instalado)

```bash
apt install postgresql postgresql-contrib -y
systemctl start postgresql
systemctl enable postgresql
```

### 1.5 Instalar PM2 (gestor de procesos)

```bash
npm install -g pm2
```

### 1.6 Instalar Nginx (servidor web)

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

---

## 🗄️ Paso 2: Configurar Base de Datos PostgreSQL

### 2.1 Crear base de datos en Hostinger

1. Accede al panel de Hostinger
2. Ve a "Bases de datos" o "Databases"
3. Crea una nueva base de datos PostgreSQL
4. Anota:
   - Nombre de la base de datos
   - Usuario
   - Contraseña
   - Host (generalmente `localhost` o la IP del servidor)
   - Puerto (generalmente `5432`)

### 2.2 Configurar PostgreSQL localmente (si es necesario)

```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos
CREATE DATABASE "9citas";

# Crear usuario
CREATE USER "9citas_user" WITH PASSWORD 'TU_CONTRASEÑA_SEGURA';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE "9citas" TO "9citas_user";

# Salir
\q
```

---

## 📦 Paso 3: Subir el Código al Servidor

### 3.1 Opción A: Usando Git (Recomendado)

```bash
# En el servidor
cd /var/www
git clone https://github.com/Aguti1902/9citas.com.git
cd 9citas.com
```

### 3.2 Opción B: Usando SCP (desde tu máquina local)

```bash
# Desde tu máquina local
scp -r /Users/guti/Desktop/CURSOR\ WEBS/9CITAS root@TU_IP_SERVIDOR:/var/www/9citas.com
```

### 3.3 Estructura de directorios

```
/var/www/9citas.com/
├── backend/
├── frontend/
└── ...
```

---

## ⚙️ Paso 4: Configurar Variables de Entorno

### 4.1 Backend - Crear archivo `.env`

```bash
cd /var/www/9citas.com/backend
nano .env
```

**Contenido del archivo `.env`:**

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://9citas_user:TU_CONTRASEÑA@localhost:5432/9citas?schema=public"

# JWT Secrets
JWT_SECRET="TU_JWT_SECRET_MUY_SEGURO_AQUI"
JWT_ACCESS_SECRET="TU_JWT_ACCESS_SECRET_MUY_SEGURO_AQUI"
JWT_REFRESH_SECRET="TU_JWT_REFRESH_SECRET_MUY_SEGURO_AQUI"

# Puerto del servidor
PORT=5000

# CORS - Dominio de producción
CORS_ORIGIN=https://9citas.com
FRONTEND_URL=https://9citas.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password_gmail
REPORTS_EMAIL=denuncias@9citas.com

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=TU_RECAPTCHA_SECRET_KEY

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Admin
ADMIN_PASSWORD=tu_contraseña_admin_segura

# Socket.IO
SOCKET_IO_PORT=5001
```

### 4.2 Frontend - Crear archivo `.env.production`

```bash
cd /var/www/9citas.com/frontend
nano .env.production
```

**Contenido del archivo `.env.production`:**

```env
VITE_API_URL=https://api.9citas.com
VITE_SOCKET_URL=https://api.9citas.com
VITE_RECAPTCHA_SITE_KEY=TU_RECAPTCHA_SITE_KEY
```

---

## 🏗️ Paso 5: Compilar y Configurar Backend

### 5.1 Instalar dependencias

```bash
cd /var/www/9citas.com/backend
npm install
```

### 5.2 Compilar TypeScript

```bash
npm run build
```

### 5.3 Ejecutar migraciones de Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar esquema a la base de datos
npx prisma db push
```

### 5.4 Verificar conexión a la base de datos

```bash
npx prisma studio
# Debería abrirse en http://localhost:5555
```

---

## 🎨 Paso 6: Compilar y Configurar Frontend

### 6.1 Instalar dependencias

```bash
cd /var/www/9citas.com/frontend
npm install
```

### 6.2 Compilar para producción

```bash
npm run build
```

Esto creará una carpeta `dist/` con los archivos estáticos.

---

## 🚀 Paso 7: Configurar PM2 (Backend)

### 7.1 Crear archivo de configuración PM2

```bash
cd /var/www/9citas.com/backend
nano ecosystem.config.js
```

**Contenido:**

```javascript
module.exports = {
  apps: [{
    name: '9citas-backend',
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/9citas/backend-error.log',
    out_file: '/var/log/9citas/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 7.2 Crear directorio de logs

```bash
mkdir -p /var/log/9citas
```

### 7.3 Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7.4 Verificar estado

```bash
pm2 status
pm2 logs 9citas-backend
```

---

## 🌐 Paso 8: Configurar Nginx

### 8.1 Crear configuración para el backend (API)

```bash
nano /etc/nginx/sites-available/9citas-api
```

**Contenido:**

```nginx
server {
    listen 80;
    server_name api.9citas.com;

    # Redirigir HTTP a HTTPS (después de configurar SSL)
    # return 301 https://$server_name$request_uri;

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
        
        # Timeouts para Socket.IO
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Tamaño máximo de archivos (para uploads)
    client_max_body_size 10M;
}
```

### 8.2 Crear configuración para el frontend

```bash
nano /etc/nginx/sites-available/9citas-frontend
```

**Contenido:**

```nginx
server {
    listen 80;
    server_name 9citas.com www.9citas.com;

    # Redirigir HTTP a HTTPS (después de configurar SSL)
    # return 301 https://$server_name$request_uri;

    root /var/www/9citas.com/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (opcional, si quieres usar el mismo dominio)
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

### 8.3 Habilitar sitios

```bash
ln -s /etc/nginx/sites-available/9citas-api /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/
```

### 8.4 Verificar y reiniciar Nginx

```bash
nginx -t
systemctl restart nginx
```

---

## 🔒 Paso 9: Configurar SSL (Certbot)

### 9.1 Instalar Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### 9.2 Obtener certificados SSL

```bash
# Para el frontend
certbot --nginx -d 9citas.com -d www.9citas.com

# Para la API
certbot --nginx -d api.9citas.com
```

### 9.3 Renovación automática

```bash
certbot renew --dry-run
```

---

## 📊 Paso 10: Migrar Datos (Si tienes datos existentes)

### 10.1 Exportar datos de la base de datos local

```bash
# Desde tu máquina local
pg_dump -h localhost -U postgres -d 9citas > backup.sql
```

### 10.2 Importar datos al servidor

```bash
# En el servidor
psql -h localhost -U 9citas_user -d 9citas < backup.sql
```

---

## ✅ Paso 11: Verificar Todo

### 11.1 Verificar backend

```bash
# Ver logs de PM2
pm2 logs 9citas-backend

# Verificar que el servidor responde
curl http://localhost:5000/api/health
```

### 11.2 Verificar frontend

```bash
# Verificar que los archivos están en su lugar
ls -la /var/www/9citas.com/frontend/dist
```

### 11.3 Verificar Nginx

```bash
# Verificar estado
systemctl status nginx

# Ver logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🔄 Paso 12: Actualizaciones Futuras

### 12.1 Actualizar código

```bash
cd /var/www/9citas.com
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

### 12.2 Actualizar base de datos

```bash
cd /var/www/9citas.com/backend
npx prisma db push
```

---

## 🐛 Solución de Problemas

### Problema: PM2 no inicia

```bash
# Ver logs
pm2 logs 9citas-backend --lines 100

# Verificar que el puerto no esté en uso
netstat -tulpn | grep 5000
```

### Problema: Nginx no funciona

```bash
# Verificar configuración
nginx -t

# Ver logs
tail -f /var/log/nginx/error.log
```

### Problema: Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
systemctl status postgresql

# Probar conexión
psql -h localhost -U 9citas_user -d 9citas
```

---

## 📝 Checklist Final

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL configurado y funcionando
- [ ] Código subido al servidor
- [ ] Variables de entorno configuradas
- [ ] Backend compilado y corriendo con PM2
- [ ] Frontend compilado
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Dominios apuntando correctamente
- [ ] Base de datos migrada (si aplica)
- [ ] Todo funcionando correctamente

---

## 🆘 Soporte

Si tienes problemas durante la migración:

1. Revisa los logs: `pm2 logs` y `/var/log/nginx/error.log`
2. Verifica las variables de entorno
3. Asegúrate de que los puertos estén abiertos en el firewall
4. Contacta con el soporte de Hostinger si es necesario

---

## 🔐 Seguridad Adicional

### Firewall (UFW)

```bash
# Instalar UFW
apt install ufw -y

# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP y HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activar firewall
ufw enable
```

### Actualizar contraseñas

Asegúrate de cambiar todas las contraseñas por defecto y usar contraseñas seguras.

---

¡Buena suerte con la migración! 🚀

