# 🔧 Solucionar Error "Cannot GET /"

## ❌ El Error

```
Cannot GET /
```

**Causa:** Nginx está corriendo pero no está sirviendo el frontend correctamente. Probablemente:
- La configuración de Nginx no está activa
- El frontend no está en la ruta correcta
- Hay un problema con los permisos

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar que Nginx Está Corriendo

```bash
sudo systemctl status nginx
```

**Debería decir:** "active (running)"

---

### Paso 2: Verificar Configuración Activa

```bash
# Ver qué configuraciones están habilitadas
ls -la /etc/nginx/sites-enabled/

# Debería mostrar:
# 9citas-frontend -> /etc/nginx/sites-available/9citas-frontend
```

**Si no está, créalo:**

```bash
sudo ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/
```

---

### Paso 3: Verificar que el Frontend Existe

```bash
ls -la /root/9citas.com/frontend/dist/index.html
```

**Debería mostrar el archivo `index.html`.**

**Si no existe, el frontend no está construido:**

```bash
cd ~/9citas.com/frontend
npm run build
```

---

### Paso 4: Verificar Permisos

```bash
# Ver permisos del directorio
ls -la /root/9citas.com/frontend/dist/

# Dar permisos si es necesario
chmod -R 755 /root/9citas.com/frontend/dist
```

---

### Paso 5: Ver Logs de Nginx

```bash
sudo tail -30 /var/log/nginx/error.log
```

**Busca errores relacionados con:**
- "No such file or directory"
- "Permission denied"
- "open() failed"

---

### Paso 6: Verificar Configuración de Nginx

```bash
cat /etc/nginx/sites-available/9citas-frontend
```

**Verifica que tenga:**
```nginx
root /root/9citas.com/frontend/dist;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}
```

---

### Paso 7: Verificar Sintaxis y Recargar

```bash
# Verificar sintaxis
sudo nginx -t

# Si está bien, recargar
sudo systemctl reload nginx

# O reiniciar
sudo systemctl restart nginx
```

---

### Paso 8: Probar de Nuevo

```bash
curl http://localhost
```

**Ahora debería mostrar HTML del frontend.**

---

## 🔍 Verificación Completa

### Ver Qué Está Escuchando Nginx

```bash
sudo nginx -T | grep -A 5 "server_name"
```

**Esto mostrará todas las configuraciones activas.**

---

### Ver Configuración Completa Activa

```bash
sudo nginx -T | grep -A 20 "server_name 9citas.com"
```

**Esto mostrará la configuración completa que Nginx está usando.**

---

## 🆘 Si Sigue Fallando

### Reconstruir Frontend

```bash
cd ~/9citas.com/frontend

# Verificar que existe .env
cat .env

# Si no existe, crearlo
cat > .env << 'EOF'
VITE_API_URL=https://api.9citas.com/api
VITE_SOCKET_URL=https://api.9citas.com
EOF

# Construir
npm run build

# Verificar que se creó
ls -la dist/
```

---

### Verificar que No Hay Configuración por Defecto Interfiriendo

```bash
# Verificar que default está deshabilitado
ls -la /etc/nginx/sites-enabled/ | grep default

# Si existe, eliminarlo
sudo rm /etc/nginx/sites-enabled/default
```

---

### Probar con IP Directa

```bash
# Probar con la IP directamente
curl http://84.32.84.32
```

**Si funciona con la IP pero no con el dominio:** Problema de DNS o configuración de server_name.

---

## 📋 Comandos Rápidos

```bash
# 1. Verificar Nginx
sudo systemctl status nginx

# 2. Ver configuraciones activas
ls -la /etc/nginx/sites-enabled/

# 3. Verificar frontend
ls -la /root/9citas.com/frontend/dist/index.html

# 4. Ver logs
sudo tail -30 /var/log/nginx/error.log

# 5. Verificar configuración
cat /etc/nginx/sites-available/9citas-frontend

# 6. Verificar sintaxis
sudo nginx -t

# 7. Recargar
sudo systemctl reload nginx

# 8. Probar
curl http://localhost
```

