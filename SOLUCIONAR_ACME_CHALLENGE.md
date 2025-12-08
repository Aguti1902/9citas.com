# 🔧 Solucionar Error 500 en /.well-known/acme-challenge/

## ❌ El Error

```
Invalid response from http://9citas.com/.well-known/acme-challenge/...: 500
```

**Causa:** Nginx no puede servir el directorio `/.well-known/acme-challenge/` que Certbot necesita para verificar el dominio.

---

## ✅ Solución: Añadir Configuración para /.well-known/

### Paso 1: Verificar que Nginx Puede Servir Archivos Estáticos

```bash
# Probar desde el servidor
curl http://9citas.com
```

**Si funciona:** El problema es específico de `/.well-known/`

---

### Paso 2: Ver Logs de Nginx para Ver el Error Exacto

```bash
sudo tail -50 /var/log/nginx/error.log
```

**Busca errores relacionados con:**
- "No such file or directory"
- "Permission denied"
- "try_files" fallando

---

### Paso 3: Editar Configuración de Nginx para Permitir /.well-known/

```bash
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Añade esta configuración ANTES de `location /`:**

```nginx
server {
    listen 80;
    server_name 9citas.com www.9citas.com;

    root /root/9citas.com/frontend/dist;
    index index.html;

    # IMPORTANTE: Permitir que Certbot acceda a /.well-known/
    location /.well-known/ {
        root /var/www/html;
        try_files $uri =404;
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

### Paso 4: Crear el Directorio para Certbot

```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chmod -R 755 /var/www/html/.well-known
```

---

### Paso 5: Verificar Sintaxis y Recargar

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### Paso 6: Probar que Funciona

```bash
# Crear un archivo de prueba
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt

# Probar que se puede acceder
curl http://9citas.com/.well-known/acme-challenge/test.txt
```

**Debería mostrar:** `test`

---

### Paso 7: Intentar Certbot de Nuevo

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

---

## 🔍 Alternativa: Usar la Misma Ruta del Frontend

Si la solución anterior no funciona, puedes usar la misma ruta del frontend:

```nginx
# En lugar de root /var/www/html, usar:
location /.well-known/ {
    root /root/9citas.com/frontend/dist;
    try_files $uri =404;
}
```

**Pero esto requiere crear el directorio en el frontend:**

```bash
mkdir -p /root/9citas.com/frontend/dist/.well-known/acme-challenge
chmod -R 755 /root/9citas.com/frontend/dist/.well-known
```

---

## 🆘 Si Sigue Fallando

### Ver Logs Detallados de Certbot

```bash
sudo tail -100 /var/log/letsencrypt/letsencrypt.log
```

**Busca errores específicos.**

---

### Probar con --dry-run y -v para Ver Más Detalles

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com --dry-run -v
```

**Esto mostrará más información sobre qué está fallando.**

---

### Verificar que el Dominio Responde Correctamente

```bash
# Desde el servidor
curl -I http://9citas.com

# Debería mostrar:
# HTTP/1.1 200 OK
```

**Si muestra 500 o 404:** Hay un problema con la configuración.

---

### Verificar que Nginx Está Escuchando en el Puerto 80

```bash
sudo netstat -tlnp | grep :80
```

**Debería mostrar que Nginx está escuchando.**

---

## 📋 Configuración Completa Recomendada

```nginx
server {
    listen 80;
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

---

## ✅ Verificación Final

Después de hacer los cambios:

1. **Verificar sintaxis:**
   ```bash
   sudo nginx -t
   ```

2. **Recargar Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

3. **Probar acceso a /.well-known/:**
   ```bash
   curl http://9citas.com/.well-known/acme-challenge/test.txt
   ```

4. **Intentar Certbot:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

