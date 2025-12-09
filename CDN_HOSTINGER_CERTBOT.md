# 🔧 Certbot con CDN de Hostinger

## ❌ El Problema

El dominio está pasando por un CDN/proxy de Hostinger (`Server: hcdn`), lo que puede impedir que Let's Encrypt verifique el dominio directamente.

---

## ✅ Solución: Deshabilitar CDN Temporalmente o Usar SSL desde Hostinger

### Opción 1: Deshabilitar CDN Temporalmente (Recomendado)

1. **Ve al panel de Hostinger**
2. **Busca "CDN" o "Cloudflare" o "Aceleración"**
3. **Deshabilita el CDN temporalmente**
4. **Espera 5-10 minutos**
5. **Intenta Certbot de nuevo:**

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

6. **Después de obtener el certificado, puedes volver a habilitar el CDN**

---

### Opción 2: Usar SSL desde el Panel de Hostinger (MÁS FÁCIL)

**Esta es la opción más fácil y recomendada:**

1. **Ve al panel de Hostinger**
2. **Busca "SSL" o "Certificados"**
3. **Activa "SSL Gratuito" o "Let's Encrypt"**
4. **Selecciona el dominio `9citas.com`**
5. **Activa SSL**

**Hostinger generará e instalará el certificado automáticamente.**

**Luego solo necesitas configurar Nginx para usar HTTPS.**

---

### Opción 3: Usar Certbot con DNS Challenge

**Si el CDN no se puede deshabilitar, usa DNS challenge:**

```bash
sudo certbot certonly --manual --preferred-challenges dns -d 9citas.com -d www.9citas.com
```

**Certbot te dará un registro TXT que debes añadir en Hostinger DNS, luego presiona Enter.**

---

## 🔍 Verificar si el CDN Está Activo

### Desde el Servidor

```bash
# Verificar IP directa
curl -I http://84.32.84.32

# Comparar con el dominio
curl -I http://9citas.com
```

**Si la IP directa muestra `Server: nginx` pero el dominio muestra `Server: hcdn`:** El CDN está activo.

---

## ✅ Después de Obtener el Certificado

### Configurar Nginx para HTTPS

```bash
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Añade configuración HTTPS:**

```nginx
server {
    listen 80 default_server;
    server_name 9citas.com www.9citas.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2 default_server;
    server_name 9citas.com www.9citas.com;

    # Si usas Certbot, los certificados están en:
    ssl_certificate /etc/letsencrypt/live/9citas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/9citas.com/privkey.pem;

    # Si usas SSL de Hostinger, pregunta dónde están los certificados

    root /root/9citas.com/frontend/dist;
    index index.html;

    location /.well-known/ {
        root /var/www/html;
        try_files $uri =404;
        allow all;
    }

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

---

## 📋 Recomendación

**Usa SSL desde el panel de Hostinger.** Es más fácil y evita problemas con el CDN.

1. **Ve al panel de Hostinger**
2. **Activa SSL gratuito**
3. **Configura Nginx para usar HTTPS** (te ayudo después)

