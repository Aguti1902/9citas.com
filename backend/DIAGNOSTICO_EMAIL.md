# 🔍 Diagnóstico de Problema con Emails

## ❌ Problema Actual

Los emails de verificación **no se están enviando** en producción (Railway).

## 🎯 Causa Raíz

Las variables de entorno SMTP **no están configuradas** en Railway o están configuradas incorrectamente.

---

## ✅ Solución Paso a Paso

### 1. Verificar Configuración Actual

Ejecuta este comando en Railway (a través de SSH o en la sección de "Deploy Logs"):

```bash
node check-smtp-config.js
```

Este script te dirá **exactamente** qué está mal con la configuración SMTP.

### 2. Configurar Variables en Railway

Ve a tu proyecto en Railway → Variables y configura:

#### Opción A: Usar Email de Hostinger (Recomendado)

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=support@9citas.com
SMTP_PASS=[contraseña-del-email-en-hostinger]
FRONTEND_URL=https://9citas.com
REPORTS_EMAIL=support@9citas.com
```

**Si `smtp.hostinger.com` no funciona, prueba:**
```env
SMTP_HOST=smtp.titan.email
```

#### Opción B: Usar Gmail (Alternativa)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=[app-password-de-16-caracteres]
FRONTEND_URL=https://9citas.com
```

**Nota:** Para Gmail necesitas generar un "App Password" desde tu cuenta de Google.

### 3. Obtener Credenciales de Hostinger

Si no tienes las credenciales del email:

1. Ve a: https://hpanel.hostinger.com
2. Inicia sesión
3. Ve a "Email" → "Cuentas de Email"
4. Busca `support@9citas.com`
5. Si no recuerdas la contraseña, cámbiala desde aquí
6. Copia la nueva contraseña y úsala en `SMTP_PASS`

### 4. Verificar Servidor SMTP de Hostinger

En el panel de Hostinger, busca "Configuración de Email" o "SMTP Settings" para ver cuál es el servidor correcto:

- `smtp.hostinger.com` (más común)
- `smtp.titan.email` (si tienes Titan Email)
- `mail.9citas.com` (si tienes DNS personalizado)

### 5. Aplicar Cambios en Railway

1. Guarda todas las variables en Railway
2. **Redeploy** el servicio (o espera a que se reinicie automáticamente)
3. Ve a "Logs" y busca estos mensajes al iniciar:

```
✅ ========================================
✅ TODAS LAS VARIABLES CRÍTICAS CONFIGURADAS
✅ ========================================
```

Si ves:

```
❌ SMTP_USER NO está configurado
❌ SMTP_PASS NO está configurado
```

Es porque las variables no se guardaron correctamente.

### 6. Probar el Envío de Email

**Opción 1: Desde Railway**

Ejecuta en Railway:

```bash
node check-smtp-config.js tu@email.com
```

Esto enviará un email de prueba a la dirección que especifiques.

**Opción 2: Registro Real**

1. Ve a: https://9citas.com/register/hetero
2. Regístrate con un email real
3. Revisa los logs en Railway, deberías ver:

```
📧 ========================================
📧 ENVIANDO EMAIL DE VERIFICACIÓN
📧 Destinatario: tu@email.com
📧 ========================================
📧 URL de verificación: https://9citas.com/verify-email/...
📧 Configurando SMTP con: smtp.hostinger.com:587
📧 Usuario SMTP: support@9citas.com
✅ ========================================
✅ EMAIL DE VERIFICACIÓN ENVIADO EXITOSAMENTE
✅ Destinatario: tu@email.com
✅ Message ID: <abc123@gmail.com>
✅ ========================================
```

4. Revisa tu bandeja de entrada (y spam)

---

## 🔍 Troubleshooting

### ❌ "SMTP_USER y SMTP_PASS deben estar configurados"

**Causa:** Las variables no están en Railway

**Solución:**
1. Ve a Railway → Variables
2. Agrega `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
3. Guarda y redeploy

### ❌ "Invalid login" o "Authentication failed"

**Causa:** Usuario o contraseña incorrectos

**Solución:**
1. Verifica que `SMTP_USER` sea `support@9citas.com`
2. Verifica que `SMTP_PASS` sea la contraseña correcta
3. Prueba acceder al webmail de Hostinger con esas credenciales
4. Si no funciona, cambia la contraseña en Hostinger y actualiza en Railway

### ❌ "Connection timeout" o "ETIMEDOUT"

**Causa:** SMTP_HOST incorrecto o puerto bloqueado

**Solución:**
1. Prueba cambiar `SMTP_HOST` a `smtp.titan.email`
2. Prueba cambiar `SMTP_PORT` a `465` (SSL)
3. Contacta a Hostinger para confirmar el servidor SMTP correcto

### ❌ "ECONNREFUSED"

**Causa:** El servidor SMTP no está disponible

**Solución:**
1. Verifica `SMTP_HOST` y `SMTP_PORT`
2. Contacta a Hostinger para verificar el estado del servicio SMTP
3. Como alternativa temporal, usa Gmail

### ⚠️ "Error al enviar email (no bloqueante)"

**Causa:** El email se intentó enviar pero falló silenciosamente

**Solución:**
1. Revisa los logs completos para ver el error exacto
2. Busca mensajes que comiencen con `❌ ERROR CRÍTICO AL ENVIAR EMAIL`
3. Sigue las soluciones según el error específico

---

## 📋 Checklist de Verificación

Antes de contactar soporte, verifica:

- [ ] Variables SMTP configuradas en Railway
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` tienen valores
- [ ] Email `support@9citas.com` existe y está activo en Hostinger
- [ ] Puedes acceder al webmail con las credenciales de `SMTP_USER` y `SMTP_PASS`
- [ ] Servicio reiniciado/redeployado en Railway después de agregar variables
- [ ] Logs muestran mensaje de validación exitosa al iniciar
- [ ] Script `check-smtp-config.js` muestra conexión exitosa

---

## 🆘 Si Nada Funciona

### Usar Gmail como alternativa temporal:

1. **Crear App Password de Gmail:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Genera un App Password
   - Cópialo (16 caracteres sin espacios)

2. **Configurar en Railway:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=[app-password-de-16-caracteres]
   ```

3. **Redeploy y probar**

**Nota:** Gmail tiene límite de 500 emails/día. Para producción a largo plazo, usa Hostinger o un servicio dedicado como SendGrid.

---

## 📞 Información para Soporte

Si necesitas contactar a Hostinger o pedir ayuda, proporciona:

1. **Tu dominio:** 9citas.com
2. **Email que intentas usar:** support@9citas.com
3. **Error específico** que ves en los logs
4. **Servidor SMTP** que estás intentando usar
5. **Plan de hosting** que tienes en Hostinger

---

## ✅ Una vez resuelto

Cuando los emails funcionen:

1. ✅ Verifica el flujo completo: Registro → Email → Verificación → Login
2. ✅ Revisa que los links de verificación funcionen
3. ✅ Prueba con diferentes proveedores de email (Gmail, Outlook, etc.)
4. ✅ Revisa que no vayan a spam
5. ✅ Monitorea los logs regularmente

---

## 🎯 Resultado Esperado

Cuando todo funcione correctamente, al registrarte verás en los logs:

```
🔍 ========================================
🔍 VALIDANDO CONFIGURACIÓN DEL SERVIDOR
🔍 ========================================
✅ DATABASE_URL: ***
✅ JWT_SECRET: ***
✅ SMTP_HOST: smtp.hostinger.com
✅ SMTP_PORT: 587
✅ SMTP_USER: support@9citas.com
✅ SMTP_PASS: ***
✅ ========================================
✅ TODAS LAS VARIABLES CRÍTICAS CONFIGURADAS
✅ ========================================

... (más logs) ...

📧 ========================================
📧 ENVIANDO EMAIL DE VERIFICACIÓN
📧 Destinatario: usuario@ejemplo.com
📧 ========================================
✅ ========================================
✅ EMAIL DE VERIFICACIÓN ENVIADO EXITOSAMENTE
✅ Destinatario: usuario@ejemplo.com
✅ Message ID: <abc123@hostinger.com>
✅ ========================================
```

Y el usuario recibirá el email de verificación en su bandeja de entrada.

