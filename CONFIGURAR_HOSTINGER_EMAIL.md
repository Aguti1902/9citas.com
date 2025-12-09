# 📧 Configurar Email de Hostinger para 9citas.com

## ✅ Email Creado

Has creado: **support@9citas.com** en Hostinger

---

## 🔧 Configuración en Railway

### Variables de Entorno Necesarias

Agrega estas variables en **Railway** (Panel → Variables):

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=support@9citas.com
SMTP_PASS=tu-contraseña-del-email
FRONTEND_URL=https://9citas.com
REPORTS_EMAIL=support@9citas.com
```

---

## 📝 Paso a Paso

### 1. Obtener la Contraseña del Email

1. **Accede al panel de Hostinger:**
   - Ve a: https://hpanel.hostinger.com
   - Inicia sesión

2. **Ve a Email:**
   - Click en "Email" → "Cuentas de Email"
   - Busca `support@9citas.com`
   - Si no recuerdas la contraseña, puedes cambiarla desde aquí

3. **Copia la contraseña:**
   - Esta será la que uses en `SMTP_PASS`

### 2. Verificar Servidor SMTP de Hostinger

Hostinger puede usar diferentes servidores SMTP dependiendo de tu plan:

**Opción 1 (Más común):**
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
```

**Opción 2 (Si tienes Titan Email):**
```
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
```

**Opción 3 (Si tienes DNS personalizado):**
```
SMTP_HOST=mail.9citas.com
SMTP_PORT=587
```

### 3. Configurar en Railway

1. **Ve a Railway:**
   - Abre tu proyecto
   - Click en "Variables"

2. **Agrega las variables:**
   ```
   SMTP_HOST = smtp.hostinger.com
   SMTP_PORT = 587
   SMTP_USER = support@9citas.com
   SMTP_PASS = [tu-contraseña-del-email]
   FRONTEND_URL = https://9citas.com
   REPORTS_EMAIL = support@9citas.com
   ```

3. **Reinicia el servicio:**
   - Click en "Deployments"
   - Click en "Redeploy" o espera a que se reinicie automáticamente

---

## 🧪 Probar la Configuración

### Opción 1: Probar con Registro Real

1. Ve a: https://9citas.com/register/hetero
2. Regístrate con un email real (puede ser el tuyo)
3. Revisa la bandeja de entrada de `support@9citas.com` (opcional)
4. Revisa la bandeja de entrada del email con el que te registraste
5. Deberías recibir el email de verificación

### Opción 2: Ver Logs en Railway

1. Ve a Railway → Tu servicio → Logs
2. Busca mensajes como:
   - `✅ Email de verificación enviado a: email@ejemplo.com`
   - `❌ Error al enviar email...` (si hay error)

---

## 🔍 Troubleshooting

### ❌ "Error: Invalid login"

**Causa:** Contraseña incorrecta o email incorrecto

**Solución:**
1. Verifica que `SMTP_USER` sea exactamente `support@9citas.com`
2. Verifica que `SMTP_PASS` sea la contraseña correcta del email
3. Prueba cambiar la contraseña en Hostinger y actualizar en Railway

### ❌ "Error: Connection timeout"

**Causa:** SMTP_HOST incorrecto o puerto bloqueado

**Solución:**
1. Prueba cambiar `SMTP_HOST` a `smtp.titan.email`
2. Prueba cambiar `SMTP_PORT` a `465` (SSL)
3. Verifica en Hostinger cuál es el servidor SMTP correcto

### ❌ "Error: Authentication failed"

**Causa:** Credenciales incorrectas o email no activo

**Solución:**
1. Verifica que el email esté activo en Hostinger
2. Prueba acceder al webmail de Hostinger con esas credenciales
3. Si no puedes acceder, el email puede estar desactivado

### ⚠️ "Modo desarrollo activado"

Si ves en los logs:
```
📧 EMAIL DE VERIFICACIÓN (MODO DESARROLLO)
```

**Significa que:**
- No hay variables SMTP configuradas
- O `SMTP_USER` o `SMTP_PASS` están vacías
- El email se muestra en consola pero no se envía

**Solución:** Verifica que todas las variables estén configuradas en Railway

---

## 📋 Checklist de Verificación

- [ ] Email `support@9citas.com` creado en Hostinger
- [ ] Contraseña del email anotada
- [ ] Variables SMTP configuradas en Railway:
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASS`
  - [ ] `FRONTEND_URL`
- [ ] Servicio reiniciado en Railway
- [ ] Email de prueba enviado y recibido
- [ ] Link de verificación funciona correctamente

---

## 🎯 Próximos Pasos

Una vez configurado:

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

- **Hostinger tiene límites:** Revisa el límite de emails/día de tu plan
- **Seguridad:** Usa una contraseña segura para el email
- **DNS:** Si tienes problemas, verifica que los registros MX estén correctos
- **Spam:** Los primeros emails pueden ir a spam, es normal

---

## 🔄 Si No Funciona

### Probar con otro servidor SMTP:

1. **Contacta a Hostinger:**
   - Pregunta cuál es el servidor SMTP correcto para tu plan
   - Puede variar según el tipo de hosting

2. **Verificar en el panel:**
   - Busca "Configuración de Email" o "SMTP Settings"
   - Debería mostrar el servidor SMTP correcto

3. **Alternativa - Usar Gmail:**
   - Si Hostinger no funciona, puedes usar Gmail temporalmente
   - Sigue las instrucciones de Gmail en `CONFIGURAR_EMAIL_PRODUCCION.md`

