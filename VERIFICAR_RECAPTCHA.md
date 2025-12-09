# 🔍 Verificar Configuración de reCAPTCHA

## ❌ Error Actual

```
POST https://www.google.com/recaptcha/api2/pat?k=6LcmqSUsAAAAAICqbLVVyf_S29YtRP9RwnqnYLUP 401 (Unauthorized)
```

**Problema:** La clave `6LcmqSUsAAAAAICqbLVVyf_S29YtRP9RwnqnYLUP` no está autorizada.

**Nota:** Esta clave es **diferente** a la que configuraste (`6LfNiSUsAAAAAJ1X4PbLa4jN4TMg2uX8u7DuPQt7`).

---

## 🔍 Verificación Inmediata

### 1. Verificar Clave en Vercel

1. Ve a: https://vercel.com
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Busca `VITE_RECAPTCHA_SITE_KEY`
5. **Verifica el valor:**
   - ✅ Debería ser: `6LfNiSUsAAAAAJ1X4PbLa4jN4TMg2uX8u7DuPQt7`
   - ❌ Si es diferente, esa es la causa del error

### 2. Si la Clave es Diferente

**Opción A: Actualizar a la Clave Correcta**

1. En Vercel, edita `VITE_RECAPTCHA_SITE_KEY`
2. Cambia el valor a: `6LfNiSUsAAAAAJ1X4PbLa4jN4TMg2uX8u7DuPQt7`
3. Guarda
4. Redeploya el proyecto

**Opción B: Usar la Clave que Está Configurada**

1. Ve a: https://www.google.com/recaptcha/admin
2. Busca el sitio que tiene la clave `6LcmqSUsAAAAAICqbLVVyf_S29YtRP9RwnqnYLUP`
3. Verifica que los dominios estén autorizados:
   - `9citas.com`
   - `www.9citas.com`
   - `localhost`
4. Si falta alguno, agrégalo

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar en Google reCAPTCHA

1. Ve a: https://www.google.com/recaptcha/admin
2. Revisa **todos** tus sitios
3. Para cada sitio, verifica:
   - ✅ Tipo: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - ✅ Dominios autorizados: `9citas.com`, `www.9citas.com`, `localhost`
   - ✅ Site Key: Copia la clave

### Paso 2: Verificar en Vercel

1. Ve a Vercel → Tu proyecto → Variables
2. Verifica `VITE_RECAPTCHA_SITE_KEY`
3. **Debe coincidir exactamente** con la Site Key de Google
4. Si no coincide, actualízala

### Paso 3: Verificar Dominios Autorizados

**IMPORTANTE:** En Google reCAPTCHA, los dominios deben estar autorizados:

1. Ve a tu sitio en Google reCAPTCHA
2. Click en "Configuración" o "Settings"
3. En "Dominios", debe haber:
   ```
   9citas.com
   www.9citas.com
   localhost
   ```
4. Si falta alguno, agrégalo y guarda
5. Espera 1-2 minutos

### Paso 4: Redeploy

1. **Vercel:** 
   - Si cambiaste la variable, redeploya manualmente
   - O espera a que se redeploye automáticamente
2. **Espera 1-2 minutos** para que se apliquen los cambios

### Paso 5: Limpiar Caché y Probar

1. **Hard Refresh:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
2. **O prueba en modo incógnito**
3. Ve a: https://www.9citas.com/register/hetero
4. El CAPTCHA debería funcionar

---

## 🚨 Si Tienes Múltiples Sitios en reCAPTCHA

Si tienes varios sitios configurados:

1. **Elimina los sitios antiguos** que no uses
2. **Usa solo uno** con los dominios correctos
3. **Actualiza Vercel** con la Site Key correcta
4. **Actualiza Railway** con la Secret Key correspondiente

---

## 📝 Checklist de Verificación

- [ ] Site Key en Vercel coincide con Google reCAPTCHA
- [ ] Secret Key en Railway coincide con Google reCAPTCHA
- [ ] Dominios `9citas.com` y `www.9citas.com` están autorizados
- [ ] Tipo de reCAPTCHA es v2 Checkbox
- [ ] Caché del navegador limpiada
- [ ] Redeploy completado
- [ ] Probado en modo incógnito

---

## ⚠️ Nota sobre el Error de CSSPeeper

El error `csspeeper-inspector-tools` es de una **extensión del navegador** (CSSPeeper), no de tu aplicación. Puedes ignorarlo o desactivar la extensión.

---

## ✅ Después de Corregir

Una vez que todo esté configurado correctamente:

1. El CAPTCHA aparecerá sin errores
2. Los usuarios podrán completarlo
3. El registro funcionará correctamente
4. El backend validará el token

