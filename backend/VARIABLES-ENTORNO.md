# 🔐 Variables de Entorno Requeridas

## Variables Obligatorias para Railway

Asegúrate de tener estas variables configuradas en Railway:

### Autenticación JWT
- `JWT_ACCESS_SECRET`: Secreto para tokens de acceso (15 minutos)
- `JWT_REFRESH_SECRET`: Secreto para tokens de refresco (7 días)
- `JWT_SECRET`: (Opcional, fallback si no hay JWT_ACCESS_SECRET)

### Base de Datos
- `DATABASE_URL`: URL de conexión a PostgreSQL

### Cloudinary (para fotos)
- `CLOUDINARY_CLOUD_NAME`: Nombre de tu cuenta Cloudinary
- `CLOUDINARY_API_KEY`: API Key de Cloudinary
- `CLOUDINARY_API_SECRET`: API Secret de Cloudinary

### OpenAI (para chatbot)
- `OPENAI_API_KEY`: API Key de OpenAI (opcional, solo si quieres chatbot)

## Cómo Configurar en Railway

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio
3. Ve a la pestaña "Variables"
4. Añade cada variable con su valor

## Generar Secretos JWT

Puedes generar secretos seguros con:

```bash
# En tu terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ejecuta esto dos veces para obtener dos secretos diferentes (uno para ACCESS y otro para REFRESH).

## Verificar Variables

Para verificar que todas las variables están configuradas, puedes añadir un endpoint de health check que las verifique (sin mostrar los valores).

