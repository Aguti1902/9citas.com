# 🔧 Corregir Permisos Completamente

## ❌ El Error

```
stat() "/root/9citas.com/frontend/dist/" failed (13: Permission denied)
```

**Causa:** Los directorios padre (`/root`, `/root/9citas.com`, `/root/9citas.com/frontend`) no tienen permisos de lectura para Nginx.

---

## ✅ Solución: Dar Permisos a Todos los Directorios

### Paso 1: Dar Permisos a Todos los Directorios Padre

```bash
# Dar permisos de lectura a todos los directorios padre
chmod 755 /root
chmod 755 /root/9citas.com
chmod 755 /root/9citas.com/frontend
chmod 755 /root/9citas.com/frontend/dist

# Dar permisos a los archivos
chmod -R 755 /root/9citas.com/frontend/dist
```

---

### Paso 2: Verificar Permisos

```bash
# Ver permisos de cada directorio
ls -ld /root
ls -ld /root/9citas.com
ls -ld /root/9citas.com/frontend
ls -ld /root/9citas.com/frontend/dist

# Todos deberían mostrar: drwxr-xr-x
```

---

### Paso 3: Recargar Nginx

```bash
sudo systemctl reload nginx
```

---

### Paso 4: Probar

```bash
curl http://localhost
```

**Ahora debería mostrar HTML del frontend.**

---

## 🔍 Si Sigue Fallando

### Verificar Usuario de Nginx

```bash
ps aux | grep nginx | head -1
```

**Debería mostrar `www-data` o `nginx` como usuario.**

---

### Dar Permisos Más Amplios (Temporal)

```bash
# Dar permisos de lectura a todo el árbol
chmod -R 755 /root/9citas.com
```

**⚠️ Esto da permisos de lectura a todos los archivos en `/root/9citas.com/`.**

---

### Alternativa: Mover Frontend a /var/www

**Si los permisos siguen siendo un problema, mueve el frontend a una ubicación más estándar:**

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

## 📋 Comandos Completos

```bash
# 1. Dar permisos a todos los directorios
chmod 755 /root
chmod 755 /root/9citas.com
chmod 755 /root/9citas.com/frontend
chmod 755 /root/9citas.com/frontend/dist
chmod -R 755 /root/9citas.com/frontend/dist

# 2. Verificar
ls -ld /root
ls -ld /root/9citas.com
ls -ld /root/9citas.com/frontend
ls -ld /root/9citas.com/frontend/dist

# 3. Recargar Nginx
sudo systemctl reload nginx

# 4. Probar
curl http://localhost

# 5. Ver logs (no debería haber errores)
sudo tail -10 /var/log/nginx/error.log
```

---

## ✅ Verificación Final

Después de dar permisos:

1. **Verificar permisos:**
   ```bash
   ls -ld /root/9citas.com/frontend/dist
   # Debería mostrar: drwxr-xr-x
   ```

2. **Probar acceso:**
   ```bash
   curl http://localhost
   # Debería mostrar HTML del frontend
   ```

3. **Ver logs:**
   ```bash
   sudo tail -10 /var/log/nginx/error.log
   # No debería haber errores de "Permission denied"
   ```

