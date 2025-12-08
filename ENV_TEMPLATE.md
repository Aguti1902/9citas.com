# 📝 Plantilla de Variables de Entorno

## Backend - `.env`

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/9citas?schema=public"

# JWT Secrets (generar con: openssl rand -base64 32)
JWT_SECRET="cambiar_por_secret_muy_seguro"
JWT_ACCESS_SECRET="cambiar_por_secret_muy_seguro"
JWT_REFRESH_SECRET="cambiar_por_secret_muy_seguro"

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
RECAPTCHA_SECRET_KEY=tu_recaptcha_secret_key

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Admin
ADMIN_PASSWORD=tu_contraseña_admin_segura

# Socket.IO
SOCKET_IO_PORT=5001
```

## Frontend - `.env.production`

Crea un archivo `.env.production` en la carpeta `frontend/` con el siguiente contenido:

```env
VITE_API_URL=https://api.9citas.com
VITE_SOCKET_URL=https://api.9citas.com
VITE_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
```

## 🔐 Generar Secrets Seguros

Para generar secrets seguros para JWT:

```bash
openssl rand -base64 32
```

Ejecuta este comando 3 veces para generar los 3 secrets diferentes.

