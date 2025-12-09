# ✅ Configuración Final de reCAPTCHA

## 🔑 Claves Configuradas

### Site Key (Frontend - Vercel)
```
6LcmqSUsAAAAAICqbLVVyf_S29YtRP9RwnqnYLUP
```

### Secret Key (Backend - Railway)
```
6LcmqSUsAAAAAOOL5-Qq7MF6QsQgBvpeiVXCZU48
```

---

## ✅ Dominios Autorizados

- ✅ `9citas.com`
- ✅ `www.9citas.com`
- ⚠️ `localhost` (agregar si necesitas desarrollo local)

---

## 🔧 Configuración en Vercel

1. Ve a: https://vercel.com → Tu proyecto → Variables
2. Busca o crea: `VITE_RECAPTCHA_SITE_KEY`
3. Valor: `6LcmqSUsAAAAAICqbLVVyf_S29YtRP9RwnqnYLUP`
4. Guarda y redeploya

---

## 🔧 Configuración en Railway

1. Ve a: https://railway.app → Tu proyecto → Variables
2. Busca o crea: `RECAPTCHA_SECRET_KEY`
3. Valor: `6LcmqSUsAAAAAOOL5-Qq7MF6QsQgBvpeiVXCZU48`
4. Guarda y redeploya

---

## ✅ Verificación

Después de configurar:

1. **Espera 1-2 minutos** para que se apliquen los cambios
2. **Limpia la caché del navegador:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
3. **O prueba en modo incógnito**
4. Ve a: https://www.9citas.com/register/hetero
5. El CAPTCHA debería aparecer y funcionar sin errores

---

## 🚨 Si Aún Hay Errores

### Error 401 (Unauthorized)

**Causa:** El dominio no está autorizado o la clave no coincide.

**Solución:**
1. Verifica en Google reCAPTCHA que los dominios estén:
   - `9citas.com`
   - `www.9citas.com`
2. Verifica que las claves en Vercel y Railway coincidan exactamente
3. Espera 2-3 minutos después de cambiar
4. Limpia la caché del navegador

### Error "tipo de clave no es válido"

**Causa:** El tipo de reCAPTCHA no es v2 Checkbox.

**Solución:**
1. Verifica en Google reCAPTCHA que el tipo sea: **reCAPTCHA v2 → "I'm not a robot" Checkbox**
2. Si es otro tipo, crea un nuevo sitio con el tipo correcto

---

## 📝 Checklist Final

- [ ] Site Key configurada en Vercel: `6LcmqSUsAAAAAICqbLVVyf_S29YtRP9RwnqnYLUP`
- [ ] Secret Key configurada en Railway: `6LcmqSUsAAAAAOOL5-Qq7MF6QsQgBvpeiVXCZU48`
- [ ] Dominios autorizados: `9citas.com`, `www.9citas.com`
- [ ] Tipo: reCAPTCHA v2 Checkbox
- [ ] Redeploy completado
- [ ] Caché limpiada
- [ ] Probado en modo incógnito

---

## ✅ Estado Actual

- ✅ Configuración limpia (solo un sitio)
- ✅ Tipo correcto (v2 Checkbox)
- ✅ Dominios autorizados
- ⏳ Falta: Actualizar claves en Vercel y Railway

