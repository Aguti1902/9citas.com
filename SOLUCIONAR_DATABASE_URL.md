# 🔧 Solución: Error DATABASE_URL no encontrado

## ❌ El Error

```
Error: Environment variable not found: DATABASE_URL
```

Esto significa que Prisma no encuentra la variable `DATABASE_URL` en el archivo `.env`.

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar que el archivo .env existe

En la terminal de Hostinger:

```bash
cd ~/9citas.com/backend
ls -la .env
```

**Debería mostrar:** `.env` (el archivo existe)

**Si dice "No such file":** El archivo no existe, créalo con:
```bash
nano .env
```

---

### Paso 2: Verificar que DATABASE_URL está en el archivo

```bash
cd ~/9citas.com/backend
cat .env | grep DATABASE_URL
```

**Debería mostrar algo como:**
```
DATABASE_URL="postgresql://postgres:..."
```

**Si no muestra nada:** La variable no está, añádela.

---

### Paso 3: IMPORTANTE - Usar URL Externa de Railway

⚠️ **PROBLEMA:** La URL de Railway que tienes es interna (`postgres.railway.internal`), pero desde Hostinger necesitas la URL **externa**.

**URL Interna (NO funciona desde Hostinger):**
```
postgresql://postgres:...@postgres.railway.internal:5432/railway
```

**URL Externa (SÍ funciona desde Hostinger):**
Necesitas obtener la URL externa de Railway.

---

### Paso 4: Obtener URL Externa de Railway

1. Ve a tu proyecto en Railway
2. Ve a la base de datos PostgreSQL
3. En la pestaña "Variables" o "Connect", busca la URL que dice **"Public Network"** o **"External"**
4. Debería ser algo como:
   ```
   postgresql://postgres:...@[algo].railway.app:5432/railway
   ```
   O
   ```
   postgresql://postgres:...@[IP]:[PUERTO]/railway
   ```

---

### Paso 5: Editar el archivo .env

```bash
cd ~/9citas.com/backend
nano .env
```

**Busca la línea:**
```
DATABASE_URL="postgresql://postgres:lPKzXGDXgdcQqXFYmirvfDkyVWDYvNPy@postgres.railway.internal:5432/railway"
```

**Cámbiala por la URL EXTERNA de Railway:**
```
DATABASE_URL="postgresql://postgres:lPKzXGDXgdcQqXFYmirvfDkyVWDYvNPy@[HOST_EXTERNO]:[PUERTO]/railway"
```

**Ejemplo (con los datos que tienes):**
```
DATABASE_URL="postgresql://postgres:lPKzXGDXgdcQqXFYmirvfDkyVWDYvNPy@containers-us-west-xxx.railway.app:5432/railway"
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

---

### Paso 6: Verificar que está correcto

```bash
cd ~/9citas.com/backend
cat .env | grep DATABASE_URL
```

Debería mostrar la URL completa.

---

### Paso 7: Probar Prisma de nuevo

```bash
cd ~/9citas.com/backend
npx prisma generate
npx prisma db push
```

Ahora debería funcionar.

---

## 🔍 Si Aún No Funciona

### Verificar que estás en el directorio correcto

```bash
pwd
# Debería mostrar: /root/9citas.com/backend
```

### Ver todo el contenido del .env

```bash
cat .env
```

Verifica que:
- ✅ El archivo existe
- ✅ Tiene `DATABASE_URL=`
- ✅ La URL está entre comillas: `DATABASE_URL="..."`
- ✅ No hay espacios extra
- ✅ La URL es EXTERNA (no `.railway.internal`)

---

## 📝 Nota sobre Railway

Railway tiene dos tipos de URLs:

1. **Interna** (`postgres.railway.internal`): Solo funciona desde dentro de Railway
2. **Externa** (`containers-us-west-xxx.railway.app` o IP): Funciona desde cualquier lugar (Hostinger)

**Necesitas la URL EXTERNA para conectarte desde Hostinger.**

---

## 🆘 Si No Encuentras la URL Externa

1. En Railway, ve a tu base de datos PostgreSQL
2. Busca la pestaña "Connect" o "Connection"
3. Busca "Public Network" o "External Connection"
4. Copia esa URL completa

Si no la encuentras, puedes:
- Crear una nueva variable en Railway con la URL externa
- O contactar con soporte de Railway para obtenerla

