# 🔧 Solucionar Error de reCAPTCHA

## ❌ Error Actual

```
Unrecognized feature: 'private-token'
Error para el propietario del sitio web: el tipo de clave no es válido
```

---

## 🔍 Causas Posibles

### 1. Dominio no autorizado en Google reCAPTCHA

**Problema:** La clave de reCAPTCHA no está autorizada para el dominio `www.9citas.com` o `9citas.com`.

**Solución:**
1. Ve a: https://www.google.com/recaptcha/admin
2. Selecciona tu sitio "9citas.com"
3. Click en "Configuración" o "Settings"
4. Verifica que en "Dominios" estén:
   - `9citas.com`
   - `www.9citas.com`
   - `localhost` (para desarrollo)
5. Si falta alguno, agrégalo y guarda
6. Espera 1-2 minutos para que se actualice

---

### 2. Tipo de reCAPTCHA incorrecto

**Problema:** La clave es de un tipo diferente (v3, Enterprise, etc.) pero el código espera v2.

**Solución:**
1. Ve a: https://www.google.com/recaptcha/admin
2. Verifica que el tipo sea: **reCAPTCHA v2 → "I'm not a robot" Checkbox**
3. Si es otro tipo, crea un nuevo sitio con el tipo correcto

---

### 3. Clave incorrecta en Vercel

**Problema:** La clave en Vercel no coincide con la Site Key de Google.

**Solución:**
1. Ve a: https://www.google.com/recaptcha/admin
2. Copia la **Site Key** (clave pública)
3. Ve a Vercel → Tu proyecto → Variables
4. Verifica que `VITE_RECAPTCHA_SITE_KEY` tenga exactamente la misma clave
5. Si es diferente, actualízala y redeploya

---

### 4. Caché del navegador

**Problema:** El navegador tiene una versión antigua del código en caché.

**Solución:**
1. **Hard Refresh:**
   - Windows: `Ctrl + F5` o `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
2. **Limpiar caché:**
   - Chrome: `Ctrl+Shift+Delete` → Selecciona "Caché" → Borrar
3. **Probar en modo incógnito:**
   - Abre una ventana de incógnito
   - Ve a https://www.9citas.com/register/hetero

---

## ✅ Verificación Paso a Paso

### Paso 1: Verificar en Google reCAPTCHA

1. Ve a: https://www.google.com/recaptcha/admin
2. Click en tu sitio "9citas.com"
3. Verifica:
   - ✅ Tipo: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - ✅ Dominios: `9citas.com`, `www.9citas.com`, `localhost`
   - ✅ Site Key: `6LfNiSUsAAAAAJ1X4PbLa4jN4TMg2uX8u7DuPQt7`
   - ✅ Secret Key: `6LfNiSUsAAAAAFvWXJ1dLuemBAIyw7Z8AzapAAXC`

### Paso 2: Verificar en Vercel

1. Ve a Vercel → Tu proyecto → Variables
2. Verifica que `VITE_RECAPTCHA_SITE_KEY` = `6LfNiSUsAAAAAJ1X4PbLa4jN4TMg2uX8u7DuPQt7`
3. Si es diferente, actualízala

### Paso 3: Verificar en Railway

1. Ve a Railway → Tu proyecto → Variables
2. Verifica que `RECAPTCHA_SECRET_KEY` = `6LfNiSUsAAAAAFvWXJ1dLuemBAIyw7Z8AzapAAXC`
3. Si es diferente, actualízala

### Paso 4: Redeploy

1. **Vercel:** Debería redeployar automáticamente, o hazlo manualmente
2. **Railway:** Debería redeployar automáticamente, o hazlo manualmente
3. Espera 1-2 minutos

### Paso 5: Probar

1. Limpia la caché del navegador
2. Ve a: https://www.9citas.com/register/hetero
3. El CAPTCHA debería aparecer sin errores

---

## 🚨 Si el Error Persiste

### Opción 1: Crear Nuevo Sitio en reCAPTCHA

1. Ve a: https://www.google.com/recaptcha/admin
2. Crea un **nuevo sitio** (no edites el existente)
3. Configura:
   - Label: `9citas.com (nuevo)`
   - Tipo: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - Dominios: `9citas.com`, `www.9citas.com`, `localhost`
4. Copia las nuevas claves
5. Actualiza en Vercel y Railway
6. Redeploya

### Opción 2: Verificar Dominio en Google

1. Asegúrate de que el dominio `9citas.com` esté correctamente configurado
2. Verifica que no haya redirecciones que cambien el dominio
3. Prueba con `9citas.com` (sin www) y `www.9citas.com`

### Opción 3: Contactar Soporte de Google

Si nada funciona, puede ser un problema del lado de Google reCAPTCHA. Contacta su soporte.

---

## 📝 Notas Importantes

- **Los cambios en Google reCAPTCHA pueden tardar 1-2 minutos en aplicarse**
- **Siempre verifica que el dominio coincida exactamente** (con/sin www)
- **No uses claves de prueba en producción** (solo funcionan en localhost)
- **El error "private-token" generalmente indica un problema de autorización de dominio**

---

## ✅ Checklist Final

- [ ] Dominios autorizados en Google reCAPTCHA
- [ ] Tipo correcto (v2 Checkbox)
- [ ] Site Key correcta en Vercel
- [ ] Secret Key correcta en Railway
- [ ] Caché del navegador limpiada
- [ ] Redeploy completado
- [ ] Probado en modo incógnito

