# 🔧 Corregir Error de Nginx

## ❌ El Error

```
unknown directive "nginx" in /etc/nginx/sites-enabled/9citas-api:2
```

Esto significa que hay un error de sintaxis en la línea 2 del archivo de configuración de Nginx.

---

## ✅ Solución Paso a Paso

### Paso 1: Ver el Contenido del Archivo

```bash
cat /etc/nginx/sites-enabled/9citas-api
```

**Esto mostrará el contenido completo del archivo.** Busca la línea 2 y verifica qué hay ahí.

---

### Paso 2: Ver Solo las Primeras Líneas

```bash
head -n 10 /etc/nginx/sites-enabled/9citas-api
```

**Esto mostrará las primeras 10 líneas.** La línea 2 probablemente tiene un error.

---

### Paso 3: Editar el Archivo

```bash
sudo nano /etc/nginx/sites-enabled/9citas-api
```

**O si prefieres editar el archivo original:**

```bash
sudo nano /etc/nginx/sites-available/9citas-api
```

---

### Paso 4: Configuración Correcta para Backend API

**El archivo debería empezar así (SIN la palabra "nginx" al principio):**

```nginx
server {
    listen 80;
    server_name api.9citas.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    client_max_body_size 10M;
}
```

**⚠️ IMPORTANTE:** El archivo debe empezar con `server {`, NO con `nginx` ni ninguna otra palabra.

---

### Paso 5: Si el Archivo Está Vacío o Muy Roto

**Elimina el archivo y créalo de nuevo:**

```bash
# Eliminar el archivo roto
sudo rm /etc/nginx/sites-enabled/9citas-api

# Crear uno nuevo
sudo nano /etc/nginx/sites-enabled/9citas-api
```

**O mejor, edita el archivo en sites-available:**

```bash
sudo nano /etc/nginx/sites-available/9citas-api
```

**Pega la configuración correcta (la de arriba)**

**Crear el enlace simbólico:**

```bash
sudo ln -s /etc/nginx/sites-available/9citas-api /etc/nginx/sites-enabled/
```

---

### Paso 6: Verificar la Configuración

```bash
sudo nginx -t
```

**Debería decir:** "syntax is ok" y "test is successful"

---

### Paso 7: Recargar Nginx

```bash
sudo systemctl reload nginx
```

**O reiniciar:**

```bash
sudo systemctl restart nginx
```

---

## 🔍 Errores Comunes

### Error 1: Palabra "nginx" al principio

**❌ Incorrecto:**
```
nginx
server {
    ...
}
```

**✅ Correcto:**
```
server {
    ...
}
```

---

### Error 2: Comentarios mal formados

**❌ Incorrecto:**
```
# Esto es un comentario
nginx server {
```

**✅ Correcto:**
```
# Esto es un comentario
server {
```

---

### Error 3: Llaves no balanceadas

**❌ Incorrecto:**
```
server {
    location / {
        ...
    }
```

**✅ Correcto:**
```
server {
    location / {
        ...
    }
}
```

---

## 📋 Configuración Completa Recomendada

### Para Backend API (api.9citas.com):

```bash
sudo nano /etc/nginx/sites-available/9citas-api
```

**Pega esto:**

```nginx
server {
    listen 80;
    server_name api.9citas.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    client_max_body_size 10M;
}
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

**Crear enlace:**
```bash
sudo ln -sf /etc/nginx/sites-available/9citas-api /etc/nginx/sites-enabled/
```

**Verificar:**
```bash
sudo nginx -t
```

**Recargar:**
```bash
sudo systemctl reload nginx
```

---

## 🆘 Si Sigue Fallando

### Ver el Error Completo:

```bash
sudo nginx -t 2>&1 | head -20
```

### Ver Todas las Configuraciones:

```bash
ls -la /etc/nginx/sites-enabled/
```

### Verificar que No Hay Archivos Duplicados:

```bash
sudo find /etc/nginx -name "*9citas*" -type f
```

### Eliminar Todos y Empezar de Nuevo:

```bash
# Eliminar todos los archivos relacionados
sudo rm /etc/nginx/sites-enabled/9citas-*
sudo rm /etc/nginx/sites-available/9citas-*

# Crear uno nuevo desde cero
sudo nano /etc/nginx/sites-available/9citas-api
# (Pega la configuración correcta)
```

---

## ✅ Verificación Final

Después de corregir:

```bash
# 1. Verificar sintaxis
sudo nginx -t

# 2. Ver estado
sudo systemctl status nginx

# 3. Probar que responde
curl http://localhost/api/health
```

