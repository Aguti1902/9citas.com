# 🔧 Solucionar Error de Permisos en Nginx

## ❌ El Error

```
stat() "/root/9citas.com/frontend/dist/" failed (13: Permission denied)
```

**Causa:** Nginx (que corre como usuario `www-data` o `nginx`) no tiene permisos para leer archivos en `/root/`.

---

## ✅ Solución: Dar Permisos de Lectura

### Opción 1: Dar Permisos de Lectura a Nginx (RÁPIDO)

```bash
# Dar permisos de lectura a todos los directorios padre
chmod 755 /root
chmod 755 /root/9citas.com
chmod 755 /root/9citas.com/frontend
chmod 755 /root/9citas.com/frontend/dist

# Dar permisos de lectura a los archivos
chmod -R 755 /root/9citas.com/frontend/dist
```

**Verificar:**
```bash
ls -la /root/9citas.com/frontend/dist
```

**Debería mostrar permisos `drwxr-xr-x` para directorios y `-rw-r--r--` para archivos.**

---

### Opción 2: Mover Frontend a /var/www (RECOMENDADO)

**Esta es la solución más segura y estándar:**

```bash
# Crear directorio
sudo mkdir -p /var/www/9citas-frontend

# Copiar archivos
sudo cp -r /root/9citas.com/frontend/dist/* /var/www/9citas-frontend/

# Dar permisos
sudo chown -R www-data:www-data /var/www/9citas-frontend
sudo chmod -R 755 /var/www/9citas-frontend
```

**Luego editar Nginx:**
```bash
sudo nano /etc/nginx/sites-available/9citas-frontend
```

**Cambiar:**
```nginx
root /root/9citas.com/frontend/dist;
```

**Por:**
```nginx
root /var/www/9citas-frontend;
```

**Guardar y recargar:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Solución Rápida (Recomendada Ahora)

**Ejecuta estos comandos:**

```bash
# 1. Dar permisos a los directorios padre
chmod 755 /root
chmod 755 /root/9citas.com
chmod 755 /root/9citas.com/frontend
chmod 755 /root/9citas.com/frontend/dist

# 2. Dar permisos a los archivos
chmod -R 755 /root/9citas.com/frontend/dist

# 3. Verificar permisos
ls -la /root/9citas.com/frontend/dist

# 4. Recargar Nginx
sudo systemctl reload nginx

# 5. Probar
curl http://localhost
```

---

## 🔍 Verificar Permisos

### Ver Permisos Actuales

```bash
ls -la /root/9citas.com/frontend/dist
```

**Debería mostrar:**
```
drwxr-xr-x  ... dist
-rw-r--r--  ... index.html
```

**Si muestra `drwx------` o `-rw-------`:** Los permisos están mal.

---

### Ver Usuario de Nginx

```bash
ps aux | grep nginx
```

**Busca el usuario** (normalmente `www-data` o `nginx`).

---

## 🆘 Si Sigue Fallando

### Verificar que los Permisos se Aplicaron

```bash
# Ver permisos del directorio
stat /root/9citas.com/frontend/dist

# Debería mostrar:
# Access: (0755/drwxr-xr-x)
```

---

### Dar Permisos Más Amplios (Temporal)

```bash
chmod -R 755 /root/9citas.com
```

**⚠️ Esto da permisos de lectura a todos los archivos en `/root/9citas.com/`.**

---

### Verificar SELinux (Si Está Activado)

```bash
getenforce
```

**Si dice "Enforcing":**
```bash
# Deshabilitar temporalmente (solo para probar)
sudo setenforce 0
```

**Si funciona, necesitas configurar SELinux correctamente.**

---

## 📋 Comandos Completos

```bash
# 1. Dar permisos
chmod 755 /root
chmod 755 /root/9citas.com
chmod 755 /root/9citas.com/frontend
chmod -R 755 /root/9citas.com/frontend/dist

# 2. Verificar
ls -la /root/9citas.com/frontend/dist

# 3. Recargar Nginx
sudo systemctl reload nginx

# 4. Probar
curl http://localhost

# 5. Ver logs (no debería haber errores)
sudo tail -10 /var/log/nginx/error.log
```

---

## ✅ Después de Corregir Permisos

1. **Probar que funciona:**
   ```bash
   curl http://localhost
   # Debería mostrar HTML del frontend
   ```

2. **Añadir configuración para /.well-known/ (si no lo has hecho):**
   ```bash
   sudo nano /etc/nginx/sites-available/9citas-frontend
   # Añade location /.well-known/ antes de location /
   ```

3. **Intentar Certbot de nuevo:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

