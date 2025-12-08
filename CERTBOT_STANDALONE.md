# 🔧 Usar Certbot en Modo Standalone (Alternativa)

## ❌ El Problema

Certbot con Nginx sigue dando error 500. Vamos a usar el modo **standalone** que no depende de Nginx.

---

## ✅ Solución: Certbot Standalone

### Paso 1: Detener Nginx Temporalmente

```bash
sudo systemctl stop nginx
```

**Esto es necesario porque Certbot standalone necesita usar el puerto 80.**

---

### Paso 2: Obtener Certificado con Standalone

```bash
sudo certbot certonly --standalone -d 9citas.com -d www.9citas.com
```

**Certbot te hará preguntas:**
- Email: tu email
- Términos: Y (Yes)
- Compartir email: N (No)

**Esto obtendrá el certificado sin usar Nginx.**

---

### Paso 3: Iniciar Nginx de Nuevo

```bash
sudo systemctl start nginx
```

---

### Paso 4: Configurar Nginx para Usar el Certificado

```bash
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Cambia la configuración para usar HTTPS:**

```nginx
server {
    listen 80;
    server_name 9citas.com www.9citas.com;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 9citas.com www.9citas.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/9citas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/9citas.com/privkey.pem;

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

**Guardar:** `Ctrl + X`, `Y`, `Enter`

---

### Paso 5: Verificar y Recargar

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### Paso 6: Configurar Renovación Automática

```bash
# Verificar que el timer está activo
sudo systemctl status certbot.timer

# Si no está activo, habilitarlo
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 🔍 Si Standalone También Falla

### Verificar que el Dominio es Accesible desde Fuera

```bash
# Desde tu ordenador (NO desde Hostinger)
curl -I http://9citas.com
```

**Debería mostrar:** `HTTP/1.1 200 OK` o `HTTP/1.1 301 Moved Permanently`

**Si muestra error o timeout:** El problema es de DNS o firewall.

---

### Verificar DNS

```bash
# Desde Hostinger
dig 9citas.com +short
nslookup 9citas.com
```

**Debería mostrar la IP de tu servidor** (84.32.84.32).

---

### Verificar Firewall

```bash
# Ver reglas de firewall
sudo ufw status

# Si está activo, permitir puertos 80 y 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 🆘 Alternativa: Usar SSL desde el Panel de Hostinger

Si Certbot sigue fallando, puedes:

1. **Ir al panel de Hostinger**
2. **Buscar "SSL" o "Certificados"**
3. **Activar SSL gratuito** (Let's Encrypt desde el panel)
4. **O usar Cloudflare** (gratis) que incluye SSL automático

---

## 📋 Comandos Completos para Standalone

```bash
# 1. Detener Nginx
sudo systemctl stop nginx

# 2. Obtener certificado
sudo certbot certonly --standalone -d 9citas.com -d www.9citas.com

# 3. Iniciar Nginx
sudo systemctl start nginx

# 4. Editar configuración para HTTPS
sudo nano /etc/nginx/sites-available/9citas-frontend
# (Añadir configuración SSL)

# 5. Verificar y recargar
sudo nginx -t
sudo systemctl reload nginx

# 6. Probar
curl https://9citas.com
```

---

## ✅ Verificación Final

Después de configurar SSL:

1. **Probar HTTPS:**
   ```bash
   curl https://9citas.com
   ```

2. **Ver certificado:**
   ```bash
   sudo certbot certificates
   ```

3. **Probar desde el navegador:**
   - Abre `https://9citas.com` en tu navegador
   - Debería mostrar el candado verde

---

## 🔄 Renovación Automática

El certificado se renueva automáticamente, pero puedes probarlo:

```bash
sudo certbot renew --dry-run
```

