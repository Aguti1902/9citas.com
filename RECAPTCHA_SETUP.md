# Configuración de Google reCAPTCHA

## 🤖 Protección Anti-Bots Implementada

Se ha añadido Google reCAPTCHA v2 en el formulario de registro para prevenir registros automáticos por bots.

## 📋 Pasos para configurar reCAPTCHA:

### 1. Obtener las claves de Google reCAPTCHA

1. Ve a https://www.google.com/recaptcha/admin
2. Inicia sesión con tu cuenta de Google
3. Registra un nuevo sitio:
   - **Label**: 9citas.com
   - **reCAPTCHA type**: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains**: 
     - `localhost` (para desarrollo)
     - `9citas-com-hev9.vercel.app` (tu dominio de Vercel)
     - `9citas.com` (tu dominio principal cuando lo tengas)
   - Acepta los términos
4. Copia las claves que te proporciona:
   - **Site Key** (clave pública)
   - **Secret Key** (clave privada)

### 2. Configurar Frontend (Vercel)

En la configuración de tu proyecto en Vercel:

1. Ve a Settings → Environment Variables
2. Añade una nueva variable:
   ```
   VITE_RECAPTCHA_SITE_KEY = tu_site_key_aqui
   ```
3. Redeploy el frontend

### 3. Configurar Backend (Railway)

En la configuración de tu proyecto en Railway:

1. Ve a Variables
2. Añade una nueva variable:
   ```
   RECAPTCHA_SECRET_KEY = tu_secret_key_aqui
   ```
3. Redeploy el backend

### 4. Variables de entorno locales (Desarrollo)

**Frontend** - Crea `.env` en `/frontend`:
```env
VITE_RECAPTCHA_SITE_KEY=tu_site_key_aqui
```

**Backend** - Añade a `/backend/.env`:
```env
RECAPTCHA_SECRET_KEY=tu_secret_key_aqui
```

## 🔑 Claves de prueba (solo desarrollo)

Si quieres probar sin configurar, puedes usar estas claves de prueba de Google:

**Site Key (Frontend)**:
```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Secret Key (Backend)**:
```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

⚠️ **IMPORTANTE**: Estas claves SIEMPRE pasan la validación. SOLO para desarrollo/testing.

## ✅ Verificación

Una vez configurado correctamente:

1. Los usuarios verán el checkbox de reCAPTCHA al registrarse
2. Deben marcar "No soy un robot" antes de poder registrarse
3. El botón de registro se deshabilitará si no completan el CAPTCHA
4. El backend verificará el token antes de crear el usuario

## 🚫 Modo degradado

Si no configuras las claves:
- El CAPTCHA se muestra pero usa la clave de prueba
- El backend permite registros sin validar (modo degradado)
- Se recomienda configurar las claves reales en producción

## 📚 Documentación oficial

- https://www.google.com/recaptcha/
- https://developers.google.com/recaptcha/docs/display

