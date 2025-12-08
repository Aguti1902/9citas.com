# 🔧 Cómo Salir de pm2 logs

## ❌ El Problema

El comando `pm2 logs` entra en modo **"tail"** (sigue mostrando logs en tiempo real), por eso parece que está "pillado".

---

## ✅ Solución: Salir del Comando

**Presiona:** `Ctrl + C`

Esto detendrá el seguimiento de logs y volverás al prompt normal.

---

## 🔍 Verificar Estado Real

Después de salir (`Ctrl + C`), ejecuta estos comandos:

### 1. Ver Estado de PM2 (sin logs en tiempo real)

```bash
pm2 status
```

**Debería mostrar:** `9citas-backend` con status `online`

---

### 2. Ver Últimas Líneas de Logs (sin seguir)

```bash
pm2 logs 9citas-backend --lines 50 --nostream
```

**Esto muestra las últimas 50 líneas y sale automáticamente** (no se queda pillado).

---

### 3. Verificar si Hay Errores

```bash
pm2 logs 9citas-backend --err --lines 20 --nostream
```

**Muestra solo errores** de las últimas 20 líneas.

---

### 4. Probar que el Backend Responde

```bash
curl http://localhost:5000/api/health
```

**Si responde con JSON:** ✅ Backend funciona
**Si no responde:** ❌ Hay un problema

---

### 5. Verificar Conexión a Base de Datos

```bash
cd ~/9citas.com/backend
npx prisma db push --skip-generate
```

**Si funciona:** ✅ Base de datos conectada
**Si falla:** ❌ Problema con DATABASE_URL

---

## 📋 Comandos Útiles

### Ver logs sin quedarse pillado:
```bash
pm2 logs 9citas-backend --lines 50 --nostream
```

### Ver solo errores:
```bash
pm2 logs 9citas-backend --err --lines 20 --nostream
```

### Ver solo salida normal:
```bash
pm2 logs 9citas-backend --out --lines 20 --nostream
```

### Reiniciar el backend:
```bash
pm2 restart 9citas-backend
```

### Ver información detallada:
```bash
pm2 info 9citas-backend
```

---

## 🎯 Qué Buscar en los Logs

### ✅ Señales de que Funciona:
- "Servidor corriendo en..."
- "Base de datos conectada"
- "WebSocket disponible"
- Sin errores de Prisma

### ❌ Señales de Problemas:
- "Error: connect ECONNREFUSED" → Problema de conexión
- "Environment variable not found: DATABASE_URL" → .env no se lee
- "Prisma Client" errors → Problema con base de datos
- "Cannot connect to database" → DATABASE_URL incorrecta

---

## 🆘 Si Sigue Pillado

Si presionas `Ctrl + C` y no sale:

1. **Presiona varias veces `Ctrl + C`**
2. **O abre una nueva terminal** en Hostinger
3. **O cierra y vuelve a abrir** la sesión SSH

---

## ✅ Resumen Rápido

1. **Presiona `Ctrl + C`** para salir de los logs
2. **Ejecuta:** `pm2 logs 9citas-backend --lines 50 --nostream`
3. **Verifica:** `curl http://localhost:5000/api/health`
4. **Revisa errores:** `pm2 logs 9citas-backend --err --lines 20 --nostream`

