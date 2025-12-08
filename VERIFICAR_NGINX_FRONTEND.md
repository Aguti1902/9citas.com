# 🔍 Verificar Nginx para Frontend

## ✅ Frontend Está Construido

El frontend está construido correctamente. El problema está en otra parte.

---

## 🔍 Verificaciones Necesarias

### 1. Verificar Configuración de Nginx

```bash
cat /etc/nginx/sites-available/9citas-frontend
```

**Debería tener:**
```nginx
server {
    listen 80;
    server_name 9citas.com www.9citas.com;

    root /root/9citas.com/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        ...
    }
}
```

**Verifica que:**
- ✅ `root` apunta a `/root/9citas.com/frontend/dist`
- ✅ `server_name` tiene `9citas.com` y `www.9citas.com`
- ✅ `listen 80` está presente

---

### 2. Verificar que el Enlace Simbólico Existe

```bash
ls -la /etc/nginx/sites-enabled/ | grep 9citas
```

**Debería mostrar:**
```
9citas-frontend -> /etc/nginx/sites-available/9citas-frontend
```

**Si NO existe, créalo:**
```bash
sudo ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/
```

---

### 3. Verificar Sintaxis de Nginx

```bash
sudo nginx -t
```

**Debería decir:** "syntax is ok" y "test is successful"

**Si hay errores, corrígelos antes de continuar.**

---

### 4. Verificar que Nginx Está Corriendo

```bash
sudo systemctl status nginx
```

**Debería decir:** "active (running)"

**Si no está corriendo:**
```bash
sudo systemctl start nginx
```

---

### 5. Probar que Nginx Sirve el Frontend Localmente

```bash
curl http://localhost
```

**Debería mostrar HTML del frontend** (código HTML con `<html>`, `<head>`, etc.)

**Si muestra "502 Bad Gateway" o "404":**
- La configuración de Nginx está mal
- O el `root` no apunta a la carpeta correcta

---

### 6. Ver Logs de Nginx para Ver el Error

```bash
sudo tail -30 /var/log/nginx/error.log
```

**Busca errores relacionados con:**
- "No such file or directory"
- "Permission denied"
- "Connection refused"

---

### 7. Verificar DNS

```bash
dig 9citas.com +short
```

**Debería mostrar la IP de tu servidor Hostinger** (ejemplo: `84.32.84.32`)

**Si muestra otra IP o nada:**
- El DNS no está configurado correctamente
- Necesitas configurar los registros A en Hostinger

**Para verificar desde fuera:**
```bash
# Desde tu ordenador (no desde Hostinger)
curl http://9citas.com
```

---

### 8. Recargar Nginx

```bash
sudo systemctl reload nginx
```

**O reiniciar:**
```bash
sudo systemctl restart nginx
```

---

## 🔧 Soluciones a Problemas Comunes

### Problema 1: Enlace Simbólico No Existe

**Solución:**
```bash
sudo ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Problema 2: Configuración de Nginx Incorrecta

**Ver el archivo:**
```bash
cat /etc/nginx/sites-available/9citas-frontend
```

**Si está mal, editar:**
```bash
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Configuración correcta:**
```nginx
server {
    listen 80;
    server_name 9citas.com www.9citas.com;

    root /root/9citas.com/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
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

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

---

### Problema 3: DNS No Configurado

**Síntoma:** `dig 9citas.com +short` no muestra la IP correcta

**Solución:**
1. Ve al panel de Hostinger
2. Ve a "DNS" o "Zona DNS"
3. Añade registros A:
   - **Nombre:** `@` o `9citas.com`
   - **Valor:** IP de tu servidor (ejemplo: `84.32.84.32`)
   - **TTL:** `3600`
4. Añade otro registro A:
   - **Nombre:** `www`
   - **Valor:** IP de tu servidor
   - **TTL:** `3600`
5. Espera 5-10 minutos para que se propague

**Para verificar tu IP:**
```bash
curl ifconfig.me
```

---

### Problema 4: Permisos Incorrectos

**Solución:**
```bash
chmod -R 755 ~/9citas.com/frontend/dist
chown -R root:root ~/9citas.com/frontend/dist
```

---

## 📋 Checklist Completo

Antes de intentar Certbot de nuevo, verifica:

- [ ] Frontend construido ✅ (ya lo tienes)
- [ ] Configuración Nginx correcta
- [ ] Enlace simbólico existe
- [ ] Sintaxis Nginx correcta (`nginx -t`)
- [ ] Nginx corriendo (`systemctl status nginx`)
- [ ] Nginx sirve localmente (`curl http://localhost` funciona)
- [ ] DNS configurado (`dig 9citas.com +short` muestra IP correcta)
- [ ] Sin errores en logs (`tail /var/log/nginx/error.log`)

---

## ✅ Después de Verificar Todo

1. **Probar localmente:**
   ```bash
   curl http://localhost
   # Debería mostrar HTML
   ```

2. **Probar desde fuera (desde tu ordenador):**
   ```bash
   curl http://9citas.com
   # Debería mostrar HTML
   ```

3. **Intentar Certbot de nuevo:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

---

## 🆘 Si Sigue Fallando

**Ver logs detallados:**
```bash
sudo tail -50 /var/log/nginx/error.log
```

**Ver configuración activa:**
```bash
sudo nginx -T | grep -A 20 "server_name 9citas.com"
```

**Probar con --dry-run:**
```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com --dry-run -v
```

Esto mostrará más detalles sobre qué está fallando.

