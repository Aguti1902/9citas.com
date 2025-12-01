# 🔧 Actualizar Base de Datos en Railway

## ⚠️ PROBLEMA

La columna `personality` no existe en la base de datos de producción. Necesitas ejecutar una migración.

## 🚀 SOLUCIÓN RÁPIDA

### Opción 1: Usar Railway CLI (Recomendado)

1. **Instala Railway CLI** (si no lo tienes):
   ```bash
   npm i -g @railway/cli
   ```

2. **Inicia sesión**:
   ```bash
   railway login
   ```

3. **Conecta a tu proyecto**:
   ```bash
   railway link
   ```

4. **Ejecuta la migración**:
   ```bash
   cd backend
   railway run npx prisma db push
   ```

### Opción 2: Desde el Dashboard de Railway

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio backend
3. Ve a la pestaña **"Deployments"**
4. Haz clic en **"New Deployment"** o **"Redeploy"**
5. Añade un **"Deploy Command"**:
   ```
   npm run build && npx prisma db push && npm start
   ```

### Opción 3: Script de Migración Automática

Añade esto a tu `package.json` en la sección `scripts`:

```json
"postinstall": "npx prisma generate",
"migrate": "npx prisma db push"
```

Y en Railway, cambia el **"Start Command"** a:
```
npm run migrate && npm start
```

## ✅ Verificar

Después de ejecutar la migración, verifica que funciona:
1. Intenta hacer login
2. Revisa los logs de Railway
3. No deberías ver el error de `personality`

## 📝 Nota

Si prefieres usar migraciones formales en lugar de `db push`, puedes crear una migración:

```bash
npx prisma migrate dev --name add_personality_field
```

Y luego aplicarla en producción con:
```bash
npx prisma migrate deploy
```

