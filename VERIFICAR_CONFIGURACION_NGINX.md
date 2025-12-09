# 🔍 Verificar Configuración Real de Nginx

## ❌ El Problema

Los permisos están correctos pero sigue dando "Cannot GET /". Esto sugiere que Nginx no está usando la configuración correcta o hay otra configuración interceptando.

---

## ✅ Verificaciones Necesarias

### Paso 1: Ver Qué Configuración Está Usando Nginx

```bash
sudo nginx -T | grep -A 20 "server_name 9citas.com"
```

**Esto mostrará la configuración completa que Nginx está usando para `9citas.com`.**

---

### Paso 2: Ver Todas las Configuraciones Activas

```bash
sudo nginx -T | grep "server_name"
```

**Esto mostrará todos los `server_name` configurados.**

---

### Paso 3: Ver Qué Está Escuchando en el Puerto 80

```bash
sudo netstat -tlnp | grep :80
```

**O con ss:**
```bash
sudo ss -tlnp | grep :80
```

**Debería mostrar que Nginx está escuchando.**

---

### Paso 4: Ver la Configuración Completa de Nginx

```bash
cat /etc/nginx/sites-available/9citas-frontend
```

**Verifica que tenga la configuración correcta.**

---

### Paso 5: Probar con el Host Header Correcto

```bash
curl -H "Host: 9citas.com" http://localhost
```

**Si esto funciona pero `curl http://localhost` no:** El problema es el `server_name`.

---

### Paso 6: Ver Si Hay Otra Configuración Interceptando

```bash
# Ver todas las configuraciones habilitadas
ls -la /etc/nginx/sites-enabled/

# Ver si hay alguna configuración por defecto
cat /etc/nginx/sites-enabled/default 2>/dev/null
```

---

## 🔧 Solución: Verificar Configuración Completa

### Ver Configuración Activa Completa

```bash
sudo nginx -T | grep -B 5 -A 30 "listen 80"
```

**Esto mostrará todas las configuraciones que escuchan en el puerto 80.**

---

### Verificar que la Configuración Tiene el Root Correcto

```bash
sudo nginx -T | grep -A 10 "server_name 9citas.com" | grep root
```

**Debería mostrar:**
```
root /root/9citas.com/frontend/dist;
```

---

## 🆘 Si la Configuración No Se Está Aplicando

### Eliminar Todas las Configuraciones y Empezar de Nuevo

```bash
# Eliminar todas las configuraciones habilitadas
sudo rm /etc/nginx/sites-enabled/*

# Crear solo la configuración del frontend
sudo ln -s /etc/nginx/sites-available/9citas-frontend /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Recargar
sudo systemctl reload nginx
```

---

### Verificar Configuración del Frontend

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
}
```

---

## 📋 Comandos de Diagnóstico

```bash
# 1. Ver configuración activa
sudo nginx -T | grep -A 20 "server_name 9citas.com"

# 2. Ver todas las configuraciones
sudo nginx -T | grep "server_name"

# 3. Ver qué está escuchando
sudo netstat -tlnp | grep :80

# 4. Probar con Host header
curl -H "Host: 9citas.com" http://localhost

# 5. Ver configuraciones habilitadas
ls -la /etc/nginx/sites-enabled/

# 6. Ver configuración del frontend
cat /etc/nginx/sites-available/9citas-frontend
```

