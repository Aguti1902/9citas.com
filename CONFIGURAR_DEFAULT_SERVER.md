# 🔧 Configurar default_server en Nginx

## ✅ El Problema Está Resuelto

Cuando usas el dominio correcto (`9citas.com`), el frontend funciona perfectamente. El problema es solo cuando accedes con `localhost` sin el header Host.

---

## ✅ Solución: Añadir default_server

### Editar Configuración

```bash
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Cambia la línea `listen 80;` por:**

```nginx
listen 80 default_server;
```

**La configuración completa debería ser:**

```nginx
server {
    listen 80 default_server;
    server_name 9citas.com www.9citas.com;

    root /root/9citas.com/frontend/dist;
    index index.html;

    # Permitir que Certbot acceda a /.well-known/
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

### Verificar y Recargar

```bash
# Verificar sintaxis
sudo nginx -t

# Recargar
sudo systemctl reload nginx
```

---

### Probar

```bash
# Ahora debería funcionar sin el header Host
curl http://localhost

# Y también con el dominio
curl -H "Host: 9citas.com" http://localhost
```

**Ambos deberían mostrar el HTML del frontend.**

---

## ✅ Verificación Final

### Probar desde Fuera

**Desde tu ordenador (NO desde Hostinger):**

```bash
curl -I http://9citas.com
```

**Debería mostrar:** `HTTP/1.1 200 OK`

---

### Intentar Certbot de Nuevo

**Ahora que el frontend funciona correctamente:**

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

**Debería funcionar ahora.**

---

## 📋 Resumen

1. **El frontend funciona correctamente** cuando usas el dominio
2. **Solo necesitas añadir `default_server`** para que funcione también con `localhost`
3. **Ahora puedes intentar Certbot de nuevo**

