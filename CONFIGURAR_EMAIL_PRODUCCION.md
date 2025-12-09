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

## 📝 Paso a Paso: Configurar Gmail

### 1. Obtener App Password de Gmail

1. **Activar verificación en 2 pasos:**
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en 2 pasos"

2. **Generar App Password:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe: "9citas Backend"
   - Copia la contraseña generada (16 caracteres sin espacios)

3. **Usar la App Password:**
   - En Railway, pon `SMTP_PASS` = la contraseña de 16 caracteres
   - **NO uses tu contraseña normal de Gmail**

### 2. Configurar Variables en Railway

1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Agrega cada variable:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = tu-email@gmail.com
SMTP_PASS = xxxx xxxx xxxx xxxx (16 caracteres sin espacios)
FRONTEND_URL = https://9citas.com
```

4. **Reinicia el servicio** para que tome las nuevas variables

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
1. **App Password incorrecta**
   - Verifica que copiaste los 16 caracteres sin espacios
   - Regenera la App Password si es necesario

2. **Verificación en 2 pasos no activada**
   - Debes activarla antes de generar App Password

3. **Variables no configuradas**
   - Verifica que todas las variables estén en Railway
   - Reinicia el servicio después de agregar variables

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

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
```

### SendGrid (Recomendado para producción)

1. Crea cuenta en SendGrid
2. Genera API Key
3. Configura:

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

