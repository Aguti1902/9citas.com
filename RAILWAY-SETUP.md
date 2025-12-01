# 🚂 Configuración de Railway - 9citas.com

## Variables de Entorno Requeridas

Asegúrate de tener estas variables configuradas en Railway:

### Obligatorias:
```
DATABASE_URL=postgresql://... (Railway te la da automáticamente)
JWT_ACCESS_SECRET=tu_secreto_super_seguro_aqui
JWT_REFRESH_SECRET=tu_secreto_refresh_super_seguro_aqui
NODE_ENV=production
PORT=4000
```

### Recomendadas:
```
BACKEND_URL=https://9citascom-production.up.railway.app
FRONTEND_URL=https://9citas-com-hev9.vercel.app,https://9citas-com-fyij.vercel.app
OPENAI_API_KEY=tu_clave_de_openai (para ChatGPT)
```

## Verificación Post-Deploy

1. **Verificar que las fotos se sirven:**
   - Abre: `https://9citascom-production.up.railway.app/fake-photos/chica1/foto1.jpeg`
   - Deberías ver la foto

2. **Verificar que los perfiles aparecen:**
   - Los 7 perfiles deberían aparecer en la navegación
   - Todas las fotos deberían mostrarse

3. **Verificar Socket.IO:**
   - El error "Token inválido" puede ser por:
     - `JWT_ACCESS_SECRET` no configurado
     - Token expirado (normal, se refresca automáticamente)

## Solución de Problemas

### Las fotos no se ven:
- Verifica que la carpeta `fake-profiles-photos` esté en el repositorio (✅ ya está)
- Verifica que Railway haya hecho el deploy completo
- Revisa los logs de Railway para ver si hay errores

### Socket.IO error "Token inválido":
- Verifica que `JWT_ACCESS_SECRET` esté configurado en Railway
- El error puede ser temporal (el token se refresca automáticamente)

### Los perfiles no aparecen:
- Verifica que solo haya 7 perfiles con `personality` configurada
- Ejecuta el script de verificación: `npx tsx src/scripts/list-all-users.ts`

