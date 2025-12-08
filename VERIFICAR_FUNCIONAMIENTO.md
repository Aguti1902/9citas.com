# ✅ Verificar que Todo Funciona en Hostinger

## 🔍 Estado Actual

Según tus logs:
- ✅ PM2 está corriendo
- ✅ Backend está "online"
- ⚠️ Servidor en puerto 5000 (verificar si es correcto)
- ❓ Verificar conexión a base de datos
- ❓ Verificar Nginx configurado

---

## 📋 Checklist de Verificación

### 1. Verificar que el Backend Responde

```bash
# Desde Hostinger, probar localmente
curl http://localhost:5000/api/health
# O el puerto que tengas configurado en .env
```

**Debería responder:** JSON con status o información del servidor

**Si no responde:** El servidor no está funcionando correctamente

---

### 2. Verificar Logs Completos (Últimas 50 líneas)

```bash
cd ~/9citas.com/backend
pm2 logs 9citas-backend --lines 50
```

**Busca:**
- ✅ "Servidor corriendo en..."
- ✅ "Base de datos conectada"
- ❌ Errores de conexión a base de datos
- ❌ Errores de Prisma

---

### 3. Verificar Conexión a Base de Datos

```bash
cd ~/9citas.com/backend
npx prisma db push --skip-generate
```

**Si funciona:** ✅ Base de datos conectada
**Si falla:** ❌ Problema con DATABASE_URL

---

### 4. Verificar Puerto Correcto

```bash
cd ~/9citas.com/backend
cat .env | grep PORT
```

**Debería mostrar:**
```
PORT=4000
```
O el puerto que hayas configurado.

**Si el servidor está en 5000 pero el .env dice 4000:**
- Hay un problema de configuración
- Verifica que el .env se está leyendo correctamente

---

### 5. Verificar Nginx Configurado

```bash
sudo nginx -t
```

**Debería decir:** "syntax is ok"

```bash
sudo systemctl status nginx
```

**Debería decir:** "active (running)"

```bash
cat /etc/nginx/sites-available/9citas.com
```

**Debería tener:**
```nginx
location /api {
    proxy_pass http://localhost:5000;  # O el puerto que uses
    ...
}
```

---

### 6. Probar desde Fuera (Internet)

```bash
# Desde tu ordenador local, prueba:
curl https://9citas.com/api/health
```

**Si funciona:** ✅ Todo está bien configurado
**Si no funciona:** ❌ Problema con Nginx o dominio

---

## 🔧 Soluciones a Problemas Comunes

### Problema 1: Servidor en Puerto Incorrecto

**Síntoma:** Servidor en 5000 pero .env dice 4000

**Solución:**
```bash
cd ~/9citas.com/backend
# Verificar .env
cat .env | grep PORT

# Si está mal, editar
nano .env
# Cambiar PORT=5000 a PORT=4000 (o viceversa)

# Reiniciar PM2
pm2 restart 9citas-backend
```

---

### Problema 2: Error de Conexión a Base de Datos

**Síntoma:** Logs muestran "Error: connect ECONNREFUSED" o "Prisma Client"

**Solución:**
```bash
cd ~/9citas.com/backend
# Verificar DATABASE_URL
cat .env | grep DATABASE_URL

# Probar conexión
npx prisma db push --skip-generate

# Si falla, verificar que la URL es EXTERNA (no .railway.internal)
```

---

### Problema 3: Nginx No Redirige Correctamente

**Síntoma:** `curl https://9citas.com/api/health` no funciona

**Solución:**
```bash
# Verificar configuración Nginx
sudo nginx -t

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar que proxy_pass apunta al puerto correcto
cat /etc/nginx/sites-available/9citas.com | grep proxy_pass
```

---

### Problema 4: SSL No Funciona

**Síntoma:** HTTPS no carga o certificado inválido

**Solución:**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar si es necesario
sudo certbot renew
```

---

## ✅ Comandos Rápidos de Verificación

```bash
# 1. Estado PM2
pm2 status

# 2. Logs backend
pm2 logs 9citas-backend --lines 20

# 3. Estado Nginx
sudo systemctl status nginx

# 4. Probar backend localmente
curl http://localhost:5000/api/health

# 5. Probar desde fuera
curl https://9citas.com/api/health

# 6. Verificar puerto en .env
cd ~/9citas.com/backend && cat .env | grep PORT

# 7. Verificar DATABASE_URL
cd ~/9citas.com/backend && cat .env | grep DATABASE_URL
```

---

## 🎯 Qué Deberías Ver si Todo Funciona

### En PM2:
```
│ 0  │ 9citas-backend    │ online    │ 0    │ ✅
```

### En Logs:
```
✅ Servidor corriendo en http://localhost:5000
✅ Base de datos conectada
✅ WebSocket disponible
```

### Desde Internet:
```bash
curl https://9citas.com/api/health
# Debería responder con JSON
```

---

## 🆘 Si Algo No Funciona

1. **Revisa los logs completos:**
   ```bash
   pm2 logs 9citas-backend --lines 100
   ```

2. **Verifica el .env:**
   ```bash
   cd ~/9citas.com/backend
   cat .env
   ```

3. **Reinicia todo:**
   ```bash
   pm2 restart 9citas-backend
   sudo systemctl restart nginx
   ```

4. **Verifica que no hay errores de sintaxis:**
   ```bash
   sudo nginx -t
   ```

