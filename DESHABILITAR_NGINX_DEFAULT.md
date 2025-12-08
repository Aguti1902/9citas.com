# 🔧 Deshabilitar Configuración por Defecto de Nginx

## ❌ El Problema

Cuando haces `curl http://localhost`, obtienes la página por defecto de Nginx en lugar del frontend. Esto significa que Nginx está usando la configuración por defecto (`default`) en lugar de tu configuración (`9citas-frontend`).

---

## ✅ Solución: Deshabilitar la Configuración por Defecto

### Paso 1: Ver Configuraciones Habilitadas

```bash
ls -la /etc/nginx/sites-enabled/
```

**Probablemente verás:**
```
default -> /etc/nginx/sites-available/default
9citas-api -> /etc/nginx/sites-available/9citas-api
9citas-frontend -> /etc/nginx/sites-available/9citas-frontend
```

**El problema es `default`** - está tomando precedencia.

---

### Paso 2: Deshabilitar la Configuración por Defecto

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**Esto elimina el enlace simbólico** (no elimina el archivo original, solo el enlace).

---

### Paso 3: Verificar que Solo Quedan Tus Configuraciones

```bash
ls -la /etc/nginx/sites-enabled/
```

**Ahora solo deberías ver:**
```
9citas-api -> /etc/nginx/sites-available/9citas-api
9citas-frontend -> /etc/nginx/sites-available/9citas-frontend
```

---

### Paso 4: Verificar Sintaxis

```bash
sudo nginx -t
```

**Debería decir:** "syntax is ok" y "test is successful"

---

### Paso 5: Recargar Nginx

```bash
sudo systemctl reload nginx
```

---

### Paso 6: Probar de Nuevo

```bash
curl http://localhost
```

**Ahora debería mostrar HTML del frontend** (no la página por defecto de Nginx).

**También prueba con el server_name:**
```bash
curl -H "Host: 9citas.com" http://localhost
```

**O desde fuera (desde tu ordenador):**
```bash
curl http://9citas.com
```

---

## 🔍 Verificación Completa

### Ver Todas las Configuraciones

```bash
# Ver habilitadas
ls -la /etc/nginx/sites-enabled/

# Ver disponibles
ls -la /etc/nginx/sites-available/
```

---

### Ver Qué Configuración Está Usando Nginx

```bash
sudo nginx -T | grep "server_name"
```

**Debería mostrar:**
```
server_name 9citas.com www.9citas.com;
server_name api.9citas.com;
```

**NO debería mostrar:**
```
server_name _;
```
(Eso es la configuración por defecto)

---

## 🆘 Si Sigue Mostrando la Página por Defecto

### Verificar Orden de Carga

Nginx carga los archivos en orden alfabético. Si `default` está antes que `9citas-frontend`, puede tomar precedencia.

**Solución:** Asegúrate de que `default` esté deshabilitado:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

### Verificar que el Frontend Está en la Ruta Correcta

```bash
ls -la /root/9citas.com/frontend/dist/index.html
```

**Debería mostrar el archivo `index.html`.**

---

### Probar con Server Name Específico

```bash
curl -H "Host: 9citas.com" http://localhost
```

**Si esto funciona pero `curl http://localhost` no:**
- El problema es que Nginx está usando `default` para requests sin `Host` header.

---

## 📋 Comandos Rápidos

```bash
# 1. Ver configuraciones habilitadas
ls -la /etc/nginx/sites-enabled/

# 2. Deshabilitar default
sudo rm /etc/nginx/sites-enabled/default

# 3. Verificar sintaxis
sudo nginx -t

# 4. Recargar
sudo systemctl reload nginx

# 5. Probar
curl http://localhost

# 6. Probar con server_name
curl -H "Host: 9citas.com" http://localhost
```

---

## ✅ Después de Corregir

Una vez que `curl http://localhost` muestre el frontend (no la página por defecto), intenta Certbot de nuevo:

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

---

## 🔍 Nota sobre DNS

Veo que:
- `dig 9citas.com +short` muestra: `84.32.84.32` ✅
- `curl ifconfig.me` muestra: `2a02:4780:28:b8dd::1` (IPv6)

**El DNS está configurado correctamente** (apunta a la IPv4 `84.32.84.32`). El problema principal es la configuración por defecto de Nginx.

