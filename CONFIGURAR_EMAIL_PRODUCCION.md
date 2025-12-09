# 📧 Configurar Email en Producción

## ✅ Cambios Implementados

1. **Email Real con Nodemailer**
   - ✅ Actualizado `email.utils.ts` para usar Nodemailer
   - ✅ Emails HTML con diseño profesional
   - ✅ Fallback a modo desarrollo si no hay configuración SMTP

2. **URL de Verificación Dinámica**
   - ✅ Usa `FRONTEND_URL` o `VERIFICATION_URL` de variables de entorno
   - ✅ Ya no está hardcodeada a Vercel antigua

---

## 🔧 Configuración en Railway (Backend)

### Variables de Entorno Necesarias

Agrega estas variables en **Railway** (Panel → Variables):

```env
# Email SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-gmail

# URL del Frontend (para links de verificación)
FRONTEND_URL=https://9citas.com

# Email para denuncias (opcional)
REPORTS_EMAIL=denuncias@9citas.com
```

---

## 📝 Paso a Paso: Configurar Email de Hostinger

### 1. Configurar Email en Hostinger

1. **Accede al panel de Hostinger:**
   - Ve a: https://hpanel.hostinger.com
   - Inicia sesión con tu cuenta

2. **Crear/Verificar email:**
   - Ve a "Email" → "Cuentas de Email"
   - Crea o verifica que existe: `support@9citas.com`
   - Anota la contraseña del email (la que configuraste al crearlo)

3. **Obtener configuración SMTP:**
   - Hostinger usa estos valores SMTP:
     - **SMTP_HOST:** `smtp.hostinger.com` o `smtp.titan.email`
     - **SMTP_PORT:** `587` (recomendado) o `465` (SSL)
     - **SMTP_USER:** `support@9citas.com`
     - **SMTP_PASS:** La contraseña del email que creaste

### 2. Configurar Variables en Railway

1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Agrega cada variable:

```
SMTP_HOST = smtp.hostinger.com
SMTP_PORT = 587
SMTP_USER = support@9citas.com
SMTP_PASS = tu-contraseña-del-email
FRONTEND_URL = https://9citas.com
REPORTS_EMAIL = support@9citas.com
```

4. **Reinicia el servicio** para que tome las nuevas variables

### 3. Verificar Configuración

**Nota:** Si `smtp.hostinger.com` no funciona, prueba con:
- `smtp.titan.email` (para planes con Titan Email)
- `mail.9citas.com` (si tienes DNS configurado)

**Puertos disponibles:**
- `587` - TLS (recomendado)
- `465` - SSL
- `25` - No recomendado (puede estar bloqueado)

---

## 🧪 Probar el Envío de Emails

### Opción 1: Probar con un Registro Real

1. Ve a: https://9citas.com/register/hetero
2. Regístrate con un email real
3. Revisa tu bandeja de entrada (y spam)
4. Deberías recibir el email de verificación

### Opción 2: Ver Logs en Railway

1. Ve a Railway → Tu servicio → Logs
2. Busca mensajes como:
   - `✅ Email de verificación enviado a: email@ejemplo.com`
   - `❌ Error al enviar email...` (si hay error)

---

## 🔍 Troubleshooting

### ❌ "Error al enviar email"

**Causas comunes:**
1. **Contraseña incorrecta (Hostinger)**
   - Verifica que la contraseña del email sea correcta
   - Prueba cambiar la contraseña en Hostinger y actualizar en Railway

2. **SMTP_HOST incorrecto**
   - Prueba con `smtp.hostinger.com`
   - Si no funciona, prueba `smtp.titan.email`
   - Verifica en el panel de Hostinger cuál es el servidor SMTP correcto

3. **Puerto bloqueado**
   - Prueba cambiar de `587` a `465` (SSL)
   - O viceversa

4. **Variables no configuradas**
   - Verifica que todas las variables estén en Railway
   - Reinicia el servicio después de agregar variables

5. **Email no verificado en Hostinger**
   - Asegúrate de que el email `support@9citas.com` esté activo
   - Verifica que puedas acceder al email desde el webmail de Hostinger

### ❌ "Email no llega"

**Soluciones:**
1. Revisa la carpeta de **Spam**
2. Verifica que el email esté correcto
3. Revisa los logs en Railway para ver si se envió
4. Prueba con otro proveedor de email (Outlook, etc.)

### ⚠️ "Modo desarrollo activado"

Si ves en los logs:
```
📧 EMAIL DE VERIFICACIÓN (MODO DESARROLLO)
```

**Significa que:**
- No hay variables SMTP configuradas
- O `SMTP_USER` o `SMTP_PASS` están vacías
- El email se muestra en consola pero no se envía

**Solución:** Configura las variables SMTP en Railway

---

## 📧 Otros Proveedores de Email

### Hostinger (Tu configuración actual) ⭐

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=support@9citas.com
SMTP_PASS=tu-contraseña-del-email
```

**Alternativas si no funciona:**
- `smtp.titan.email` (para planes con Titan Email)
- `mail.9citas.com` (si tienes DNS configurado)

### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=app-password-16-caracteres
```

**Nota:** Requiere App Password (no contraseña normal)

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
```

### SendGrid (Recomendado para producción masiva)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx (tu API key)
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@tu-dominio.mailgun.org
SMTP_PASS=tu-password-mailgun
```

---

## ✅ Checklist de Verificación

- [ ] Variables SMTP configuradas en Railway
- [ ] `FRONTEND_URL` configurada correctamente
- [ ] App Password de Gmail generada
- [ ] Servicio reiniciado en Railway
- [ ] Email de prueba enviado y recibido
- [ ] Link de verificación funciona correctamente

---

## 🎯 Próximos Pasos

Una vez configurado el email:

1. **Probar flujo completo:**
   - Registro → Email → Verificación → Login

2. **Verificar que los emails lleguen:**
   - Revisa bandeja de entrada
   - Revisa spam
   - Verifica que los links funcionen

3. **Monitorear:**
   - Revisa logs en Railway
   - Verifica que no haya errores

---

## 📝 Notas Importantes

- **Gmail tiene límites:** Máximo 500 emails/día en cuenta gratuita
- **Para producción masiva:** Considera SendGrid o Mailgun
- **Seguridad:** Nunca pongas tu contraseña normal de Gmail, solo App Passwords
- **URL de verificación:** Debe apuntar a tu dominio real (9citas.com)

