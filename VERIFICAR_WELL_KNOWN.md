# 🔍 Verificar y Corregir /.well-known/acme-challenge/

## ❌ El Error Persiste

```
Invalid response from http://9citas.com/.well-known/acme-challenge/...: 500
```

**Necesitamos verificar que la configuración está correcta.**

---

## ✅ Verificaciones Paso a Paso

### Paso 1: Verificar que la Configuración Existe

```bash
cat /etc/nginx/sites-available/9citas-frontend | grep -A 5 "well-known"
```

**Debería mostrar:**
```nginx
location /.well-known/ {
    root /var/www/html;
    try_files $uri =404;
    allow all;
}
```

**Si NO muestra nada:** La configuración no está añadida.

---

### Paso 2: Verificar que el Directorio Existe

```bash
ls -la /var/www/html/.well-known/acme-challenge/
```

**Si dice "No such file or directory":** El directorio no existe, créalo.

---

### Paso 3: Ver Logs de Nginx para Ver el Error Específico

```bash
sudo tail -30 /var/log/nginx/error.log
```

**Busca errores relacionados con `/.well-known/`.**

---

## 🔧 Solución Completa

### Si la Configuración NO Existe:

```bash
# 1. Editar configuración
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Añade esto ANTES de `location /`:**

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
        allow all;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ... resto de la configuración ...
}
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

---

### Crear el Directorio:

```bash
# 1. Crear directorio
sudo mkdir -p /var/www/html/.well-known/acme-challenge

# 2. Dar permisos
sudo chmod -R 755 /var/www/html/.well-known
sudo chown -R www-data:www-data /var/www/html/.well-known

# 3. Verificar
ls -la /var/www/html/.well-known/acme-challenge/
```

---

### Verificar y Recargar:

```bash
# 1. Verificar sintaxis
sudo nginx -t

# 2. Recargar
sudo systemctl reload nginx

# 3. Probar
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt
curl http://9citas.com/.well-known/acme-challenge/test.txt
```

**Debería mostrar:** `test`

---

## 🆘 Si Sigue Fallando

### Ver Logs Detallados:

```bash
sudo tail -50 /var/log/nginx/error.log | grep well-known
```

---

### Probar Acceso Directo:

```bash
# Crear archivo de prueba
echo "test123" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt

# Probar desde el servidor
curl http://localhost/.well-known/acme-challenge/test.txt

# Probar con el dominio
curl http://9citas.com/.well-known/acme-challenge/test.txt
```

**Si `localhost` funciona pero el dominio no:** Problema de DNS o configuración.

**Si ninguno funciona:** Problema de permisos o configuración de Nginx.

---

### Verificar Configuración Completa:

```bash
sudo nginx -T | grep -A 10 "server_name 9citas.com"
```

**Esto mostrará la configuración completa que Nginx está usando.**

---

## 🔍 Alternativa: Usar la Misma Ruta del Frontend

Si `/var/www/html` no funciona, puedes usar la misma ruta del frontend:

```nginx
location /.well-known/ {
    root /root/9citas.com/frontend/dist;
    try_files $uri =404;
    allow all;
}
```

**Pero necesitas crear el directorio:**

```bash
mkdir -p /root/9citas.com/frontend/dist/.well-known/acme-challenge
chmod -R 755 /root/9citas.com/frontend/dist/.well-known
```

---

## 📋 Comandos de Verificación Completa

```bash
# 1. Verificar configuración
cat /etc/nginx/sites-available/9citas-frontend | grep -A 5 "well-known"

# 2. Verificar directorio
ls -la /var/www/html/.well-known/acme-challenge/

# 3. Ver logs
sudo tail -30 /var/log/nginx/error.log

# 4. Probar acceso
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt
curl http://9citas.com/.well-known/acme-challenge/test.txt

# 5. Ver configuración activa
sudo nginx -T | grep -A 10 "server_name 9citas.com"
```

---

## ✅ Configuración Correcta Completa

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

