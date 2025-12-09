# 🔧 Variables de Entorno en Vercel

## ✅ Variable Requerida (Ya Configurada)

### `VITE_API_URL`
- **Valor actual:** `https://9citascom-production.up.railway.app/api`
- **Estado:** ✅ Configurada
- **Descripción:** URL base del backend API

---

## 📋 Variables Opcionales

### `VITE_SOCKET_URL` (Opcional)
- **Descripción:** URL del servidor Socket.IO
- **Comportamiento:** Si no está configurada, se infiere automáticamente de `VITE_API_URL` (quitando `/api`)
- **Ejemplo:** Si `VITE_API_URL = https://9citascom-production.up.railway.app/api`
  - Entonces `VITE_SOCKET_URL` será: `https://9citascom-production.up.railway.app`
- **Recomendación:** No es necesario configurarla, el código la infiere automáticamente

### `VITE_RECAPTCHA_SITE_KEY` (Opcional)
- **Descripción:** Clave pública de Google reCAPTCHA
- **Comportamiento:** Si no está configurada, usa una clave de prueba por defecto
- **Valor por defecto:** `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` (solo para pruebas)
- **Recomendación:** Configurar con tu clave real de reCAPTCHA para producción

---

## ✅ Configuración Actual

Con solo `VITE_API_URL` configurada, la aplicación debería funcionar correctamente:

1. ✅ **API Calls:** Funcionan con `VITE_API_URL`
2. ✅ **Socket.IO:** Se conecta automáticamente a la URL base (sin `/api`)
3. ⚠️ **reCAPTCHA:** Usa clave de prueba (funciona pero no es segura)

---

## 🔍 Verificación

### ¿Cómo verificar que funciona?

1. **Abre la consola del navegador** (F12)
2. **Busca estos mensajes:**
   - `✅ Conectado a Socket.IO` (si Socket.IO funciona)
   - Errores de CORS (si hay problemas)

3. **Prueba el registro:**
   - Ve a: https://www.9citas.com/register/hetero
   - Intenta registrarte
   - Debería funcionar sin errores

---

## ⚠️ Sobre el Warning en Vercel

Si ves un **triángulo amarillo** (⚠️) en el campo "Name" de `VITE_API_URL`:

- **No es un error crítico**
- Puede ser una advertencia de formato
- La variable funciona correctamente si el valor está bien

**Para verificar:**
- El valor debe ser: `https://9citascom-production.up.railway.app/api`
- Debe terminar en `/api`
- No debe tener espacios al inicio o final

---

## 🎯 Recomendación

### Para Producción Completa:

1. **Mantener `VITE_API_URL`** ✅ (ya configurada)

2. **Agregar `VITE_RECAPTCHA_SITE_KEY`** (opcional pero recomendado):
   - Obtén tu clave en: https://www.google.com/recaptcha/admin
   - Agrega la clave pública en Vercel
   - Esto reemplazará la clave de prueba

3. **`VITE_SOCKET_URL`** NO es necesaria:
   - El código la infiere automáticamente
   - Solo configúrala si tienes un servidor Socket.IO separado

---

## 📝 Resumen

**Mínimo necesario:**
- ✅ `VITE_API_URL` (ya configurada)

**Recomendado:**
- ✅ `VITE_API_URL` (ya configurada)
- ⚠️ `VITE_RECAPTCHA_SITE_KEY` (para producción real)

**Opcional:**
- `VITE_SOCKET_URL` (se infiere automáticamente)

---

## ✅ Estado Actual

Con la configuración actual (`VITE_API_URL` solamente), la aplicación debería funcionar correctamente. El warning en Vercel no debería afectar el funcionamiento.

