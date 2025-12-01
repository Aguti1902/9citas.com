# 🚀 Configurar Railway - Guía Completa

## 📋 Variables de Entorno Necesarias

Copia y pega estas variables en Railway:

### 1. Autenticación JWT (OBLIGATORIO)

```
JWT_ACCESS_SECRET=aqui_va_el_secreto_que_generare
JWT_REFRESH_SECRET=aqui_va_el_otro_secreto_que_generare
```

### 2. Base de Datos (Ya debería estar configurado)

```
DATABASE_URL=tu_url_de_postgresql
```

### 3. Cloudinary (Para subir fotos)

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. OpenAI (Opcional - Solo si quieres chatbot)

```
OPENAI_API_KEY=sk-tu-api-key
```

## 🔧 Pasos para Configurar en Railway

1. **Ve a Railway**: https://railway.app
2. **Selecciona tu proyecto** → **Servicio Backend**
3. **Pestaña "Variables"** (en el menú lateral)
4. **Haz clic en "New Variable"** para cada una
5. **Copia y pega** las variables de arriba (con los valores que generaré)
6. **Guarda** y **reinicia el servicio**

## ⚠️ IMPORTANTE

Después de añadir las variables, **DEBES REINICIAR** el servicio en Railway para que los cambios surtan efecto.

## 🔍 Verificar que Funciona

1. Ve a los **logs** de Railway
2. Intenta hacer login
3. Si ves errores, revisa los logs para ver qué falta

