# 🔧 Corregir Permisos de /.well-known/

## ✅ Estado Actual

- ✅ Configuración existe y está correcta
- ✅ Directorio existe
- ❌ Permisos incorrectos (es `root:root` pero debería ser `www-data:www-data`)

---

## 🔧 Solución: Cambiar Permisos

### Paso 1: Cambiar Propietario y Permisos

```bash
# Cambiar propietario a www-data
sudo chown -R www-data:www-data /var/www/html/.well-known

# Dar permisos de escritura
sudo chmod -R 755 /var/www/html/.well-known

# Verificar
ls -la /var/www/html/.well-known/acme-challenge/
```

**Ahora debería mostrar:**
```
drwxr-xr-x 2 www-data www-data 4096 ...
```

---

### Paso 2: Probar que Funciona

```bash
# Crear archivo de prueba
echo "test123" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt

# Probar desde el servidor
curl http://localhost/.well-known/acme-challenge/test.txt

# Probar con el dominio
curl http://9citas.com/.well-known/acme-challenge/test.txt
```

**Ambos deberían mostrar:** `test123`

---

### Paso 3: Verificar que Nginx Puede Escribir

```bash
# Verificar usuario de Nginx
ps aux | grep nginx | head -1
```

**Debería mostrar `www-data` o `nginx` como usuario.**

---

### Paso 4: Recargar Nginx

```bash
sudo systemctl reload nginx
```

---

### Paso 5: Intentar Certbot de Nuevo

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

---

## 🔍 Si Sigue Fallando

### Ver Logs Detallados de Certbot

```bash
sudo tail -100 /var/log/letsencrypt/letsencrypt.log
```

**Busca errores específicos.**

---

### Probar con --dry-run y -v

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com --dry-run -v
```

**Esto mostrará más detalles sobre qué está fallando.**

---

### Verificar que el Dominio Responde

```bash
# Desde el servidor
curl -I http://9citas.com

# Debería mostrar:
# HTTP/1.1 200 OK
```

---

## 📋 Comandos Completos

```bash
# 1. Cambiar permisos
sudo chown -R www-data:www-data /var/www/html/.well-known
sudo chmod -R 755 /var/www/html/.well-known

# 2. Verificar
ls -la /var/www/html/.well-known/acme-challenge/

# 3. Probar
echo "test123" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt
curl http://9citas.com/.well-known/acme-challenge/test.txt

# 4. Recargar Nginx
sudo systemctl reload nginx

# 5. Intentar Certbot
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

---

## ✅ Verificación Final

Después de cambiar permisos:

1. **Verificar permisos:**
   ```bash
   ls -la /var/www/html/.well-known/acme-challenge/
   # Debería mostrar www-data:www-data
   ```

2. **Probar acceso:**
   ```bash
   curl http://9citas.com/.well-known/acme-challenge/test.txt
   # Debería mostrar: test123
   ```

3. **Intentar Certbot:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

