# 🔧 Solucionar Error 500 en Certbot

## ❌ El Error

```
Invalid response from http://9citas.com/.well-known/acme-challenge/...: 500
```

**Causa:** Nginx no puede servir el frontend porque:
- El frontend no está construido (no hay archivos en `dist/`)
- O Nginx no está configurado correctamente
- O el DNS no está apuntando correctamente

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar que el Frontend Está Construido

```bash
ls -la ~/9citas.com/frontend/dist
```

**Si dice "No such file or directory":** El frontend no está construido, necesitas construirlo.

**Si muestra archivos:** El frontend está construido, pasa al Paso 2.

---

### Paso 2: Construir el Frontend

```bash
cd ~/9citas.com/frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Crear archivo .env si no existe
cat > .env << 'EOF'
VITE_API_URL=https://api.9citas.com/api
VITE_SOCKET_URL=https://api.9citas.com
EOF

# Construir el frontend
npm run build
```

**Esto creará la carpeta `dist/` con los archivos estáticos.**

---

### Paso 3: Verificar que Nginx Está Configurado Correctamente

```bash
# Ver la configuración del frontend
cat /etc/nginx/sites-available/9citas-frontend
```

**Debería tener algo como:**

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

**Verificar que el `root` apunta a la carpeta correcta:**
```bash
# Debería ser:
root /root/9citas.com/frontend/dist;
```

---

### Paso 4: Verificar que el Enlace Simbólico Existe

```bash
ls -la /etc/nginx/sites-enabled/ | grep 9citas
```

**Debería mostrar:**
```
9citas-frontend -> /etc/nginx/sites-available/9citas-frontend
```

**Si no existe, créalo:**
```bash
sudo ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/
```

---

### Paso 5: Verificar Permisos de la Carpeta dist

```bash
# Dar permisos de lectura
chmod -R 755 ~/9citas.com/frontend/dist
chown -R root:root ~/9citas.com/frontend/dist
```

---

### Paso 6: Verificar Logs de Nginx

```bash
sudo tail -f /var/log/nginx/error.log
```

**En otra terminal, prueba:**
```bash
curl http://9citas.com
```

**Busca errores en los logs.** Los errores más comunes:
- `No such file or directory` → El frontend no está construido
- `Permission denied` → Problema de permisos
- `Connection refused` → Nginx no está corriendo

---

### Paso 7: Probar que Nginx Sirve el Frontend

```bash
# Desde el servidor
curl http://localhost
```

**Debería mostrar HTML del frontend.**

**Si muestra "502 Bad Gateway" o "404":**
- El frontend no está construido
- O Nginx no está configurado correctamente

---

### Paso 8: Verificar DNS

```bash
# Verificar que el DNS apunta correctamente
dig 9citas.com +short
```

**Debería mostrar la IP de tu servidor Hostinger** (ejemplo: `84.32.84.32`).

**Si muestra otra IP o nada:**
- El DNS no está configurado correctamente
- Necesitas configurar los registros A en Hostinger

---

### Paso 9: Recargar Nginx

```bash
# Verificar sintaxis
sudo nginx -t

# Si está bien, recargar
sudo systemctl reload nginx
```

---

### Paso 10: Intentar Certbot de Nuevo

**Solo después de que todo lo anterior funcione:**

```bash
# Probar primero con --dry-run (no hace cambios reales)
sudo certbot --nginx -d 9citas.com -d www.9citas.com --dry-run

# Si funciona, ejecutar de verdad
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

---

## 🔍 Verificación Completa

### Checklist Antes de Certbot:

- [ ] Frontend construido (`ls -la ~/9citas.com/frontend/dist` muestra archivos)
- [ ] Nginx configurado (`cat /etc/nginx/sites-available/9citas-frontend` tiene `root` correcto)
- [ ] Enlace simbólico existe (`ls -la /etc/nginx/sites-enabled/ | grep 9citas`)
- [ ] Permisos correctos (`chmod -R 755 ~/9citas.com/frontend/dist`)
- [ ] Nginx funciona (`curl http://localhost` muestra HTML)
- [ ] DNS configurado (`dig 9citas.com +short` muestra IP correcta)
- [ ] Nginx sin errores (`sudo nginx -t` dice "syntax is ok")

---

## 🆘 Soluciones a Problemas Específicos

### Problema 1: Frontend No Construido

**Síntoma:** `ls -la ~/9citas.com/frontend/dist` dice "No such file"

**Solución:**
```bash
cd ~/9citas.com/frontend
npm install
npm run build
```

---

### Problema 2: Nginx No Encuentra los Archivos

**Síntoma:** Logs muestran "No such file or directory"

**Solución:**
```bash
# Verificar que la ruta en Nginx es correcta
cat /etc/nginx/sites-available/9citas-frontend | grep root

# Debería ser:
# root /root/9citas.com/frontend/dist;

# Si no, editar:
sudo nano /etc/nginx/sites-available/9citas-frontend
# Cambiar la línea root a la ruta correcta
```

---

### Problema 3: Permisos Incorrectos

**Síntoma:** Logs muestran "Permission denied"

**Solución:**
```bash
chmod -R 755 ~/9citas.com/frontend/dist
chown -R root:root ~/9citas.com/frontend/dist
```

---

### Problema 4: DNS No Configurado

**Síntoma:** `dig 9citas.com +short` no muestra la IP correcta

**Solución:**
1. Ve al panel de Hostinger
2. Ve a "DNS" o "Zona DNS"
3. Añade registros A:
   - Nombre: `@` o `9citas.com`
   - Valor: IP de tu servidor (ejemplo: `84.32.84.32`)
   - TTL: `3600`
4. Añade otro registro A:
   - Nombre: `www`
   - Valor: IP de tu servidor
   - TTL: `3600`
5. Espera 5-10 minutos para que se propague

---

## 📋 Comandos Rápidos de Verificación

```bash
# 1. Verificar frontend construido
ls -la ~/9citas.com/frontend/dist

# 2. Construir frontend si no está
cd ~/9citas.com/frontend && npm run build

# 3. Verificar Nginx
sudo nginx -t

# 4. Ver logs de Nginx
sudo tail -20 /var/log/nginx/error.log

# 5. Probar localmente
curl http://localhost

# 6. Verificar DNS
dig 9citas.com +short

# 7. Recargar Nginx
sudo systemctl reload nginx
```

---

## ✅ Después de Corregir Todo

1. **Verificar que funciona:**
   ```bash
   curl http://9citas.com
   # Debería mostrar HTML del frontend
   ```

2. **Intentar Certbot de nuevo:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

3. **Si sigue fallando, usar --dry-run para ver el error:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com --dry-run -v
   ```

