# 🔧 Solución de CORS en Railway

## Problema
El error indica que CORS está bloqueando las peticiones desde el frontend en Vercel al backend en Railway.

## Solución

### 1. Configurar Variable de Entorno en Railway

Ve a tu proyecto en Railway:
1. Abre tu proyecto: https://railway.app
2. Selecciona el servicio del backend
3. Ve a la pestaña **Variables**
4. Añade la variable de entorno:

```
FRONTEND_URL=https://9citas-com-hev9.vercel.app,https://9citas-com-fyij.vercel.app
```

**Importante**: Si tienes múltiples URLs del frontend, sepáralas con comas (sin espacios).

### 2. Verificar que el Backend se Reinició

Después de añadir la variable:
- Railway debería reiniciar automáticamente el servicio
- O puedes hacer un redeploy manual

### 3. Verificar los Logs

En Railway, ve a la pestaña **Logs** y busca:
```
🌐 Orígenes CORS permitidos: [array de URLs]
```

Deberías ver las URLs del frontend listadas.

### 4. Probar la Conexión

Una vez configurado, prueba:
- Login
- Registro
- Socket.IO debería conectarse correctamente

## URLs Actuales

- **Frontend**: `https://9citas-com-hev9.vercel.app`
- **Backend**: `https://9citascom-production.up.railway.app`

## Si el Problema Persiste

1. Verifica que la URL del frontend en Railway sea exactamente la misma (sin trailing slash)
2. Verifica que el backend esté corriendo (health check: `https://9citascom-production.up.railway.app/api/health`)
3. Revisa los logs de Railway para ver qué origen está siendo bloqueado
4. Asegúrate de que no haya espacios en la variable `FRONTEND_URL`

## Debug

El código ahora imprime en los logs:
- ✅ Cuando un origen es permitido
- ⚠️ Cuando un origen es bloqueado (con la lista de orígenes permitidos)

Esto te ayudará a identificar el problema.

