# 👤 Transferir Proyecto a Cliente - Guía Completa

## 📋 Opciones para Entregar el Proyecto

Tienes **3 opciones principales** para que el cliente tenga control total:

---

## ✅ OPCIÓN 1: Transferir Proyecto en Railway (Recomendado)

### Paso 1: Cliente crea cuenta en Railway

1. El cliente debe ir a: https://railway.app
2. Crear una cuenta (puede usar GitHub, Google, etc.)
3. Confirmar el email

### Paso 2: Transferir el Proyecto

**Opción A: Invitar como Admin (temporal)**
1. Ve a tu proyecto en Railway
2. Click en "Settings" → "Team"
3. Click en "Add Team Member"
4. Invita al email del cliente
5. Asigna rol "Admin"
6. El cliente acepta la invitación

**Opción B: Transferir propiedad completa**
1. Ve a Railway → Tu proyecto → Settings
2. Busca "Transfer Project" o "Change Owner"
3. Introduce el email del cliente
4. Confirma la transferencia
5. El cliente acepta y se convierte en propietario

### Paso 3: Cliente configura acceso

1. El cliente accede a Railway con su cuenta
2. Ve el proyecto transferido
3. Puede:
   - Ver todas las variables de entorno
   - Modificar configuración
   - Ver logs
   - Hacer deploys
   - Gestionar la base de datos

---

## ✅ OPCIÓN 2: Cliente crea nuevo proyecto (Más trabajo)

### Paso 1: Cliente crea cuenta Railway

1. Cliente crea cuenta en Railway
2. Crea un nuevo proyecto PostgreSQL
3. Obtiene las nuevas credenciales

### Paso 2: Exportar/Importar base de datos

1. **Exportar datos actuales:**
   ```bash
   # Desde tu terminal o Railway
   pg_dump [DATABASE_URL_ACTUAL] > backup.sql
   ```

2. **Importar en nueva base de datos:**
   ```bash
   # Conectarse a la nueva base de datos del cliente
   psql [NUEVA_DATABASE_URL] < backup.sql
   ```

3. **Actualizar variables de entorno:**
   - Cliente actualiza `DATABASE_URL` con su nueva base de datos
   - Cliente actualiza todas las demás variables

### Paso 3: Cliente despliega el código

1. Cliente conecta su GitHub al proyecto Railway
2. Railway despliega automáticamente
3. Actualiza variables de entorno

**⚠️ Desventajas:**
- Más trabajo
- Puede haber downtime
- Hay que migrar datos

---

## ✅ OPCIÓN 3: Compartir acceso (Temporal - No recomendado)

1. Invitar cliente como "Viewer" o "Developer"
2. Compartir credenciales (no seguro)
3. El cliente puede ver pero no tiene control total

**⚠️ No recomendado para entrega final**

---

## 🎯 RECOMENDACIÓN: Opción 1 (Transferir Proyecto)

Es la más simple y directa. El cliente:
- ✅ Tiene control total
- ✅ Puede gestionar todo
- ✅ No necesita migrar datos
- ✅ Mantiene todo funcionando

---

## 📝 Pasos Detallados para Transferir en Railway

### Paso 1: Preparar Documentación

Antes de transferir, crea un documento con:

1. **Todas las variables de entorno necesarias:**
   ```env
   DATABASE_URL=...
   JWT_ACCESS_SECRET=...
   JWT_REFRESH_SECRET=...
   SMTP_HOST=...
   SMTP_USER=...
   SMTP_PASS=...
   FRONTEND_URL=...
   RECAPTCHA_SECRET_KEY=...
   CLOUDINARY_...
   etc.
   ```

2. **Accesos importantes:**
   - Email: support@9citas.com
   - Google reCAPTCHA: Site Key y Secret Key
   - Cloudinary: API Key, Secret, Cloud Name
   - Vercel: URL y configuraciones

3. **Documentación técnica:**
   - Cómo hacer deploys
   - Cómo ver logs
   - Cómo actualizar variables
   - Cómo hacer backups

### Paso 2: Transferir Proyecto

1. **En Railway:**
   - Ve a: https://railway.app
   - Selecciona tu proyecto
   - Settings → Team
   - "Transfer Ownership" o "Add Team Member"
   - Ingresa el email del cliente
   - Confirma

2. **El cliente:**
   - Recibe email de invitación
   - Acepta la invitación
   - Se convierte en propietario/admin

### Paso 3: Entrega de Credenciales

**IMPORTANTE:** Entrega estas credenciales de forma segura:

1. **Email de Hostinger:**
   - support@9citas.com
   - Contraseña del email

2. **Google reCAPTCHA:**
   - URL: https://www.google.com/recaptcha/admin
   - Site Key (ya está en Vercel)
   - Secret Key (ya está en Railway)

3. **Cloudinary:**
   - Cloud Name
   - API Key
   - API Secret

4. **Vercel:**
   - URL del proyecto
   - Variables de entorno configuradas

### Paso 4: Capacitación (Opcional)

Si el cliente necesita gestionar la app:

1. **Gestión básica:**
   - Cómo ver logs en Railway
   - Cómo hacer redeploy
   - Cómo actualizar variables

2. **Gestión avanzada:**
   - Cómo hacer backups de la base de datos
   - Cómo actualizar el código
   - Cómo gestionar usuarios

---

## 📋 Checklist de Entrega

### Información a Entregar:

- [ ] Acceso a Railway (proyecto transferido)
- [ ] Acceso a Vercel (o transferir proyecto)
- [ ] Credenciales de Hostinger (email)
- [ ] Acceso a Google reCAPTCHA
- [ ] Credenciales de Cloudinary
- [ ] Documentación de variables de entorno
- [ ] Documentación técnica básica
- [ ] Código fuente (ya está en GitHub)

### Documentación a Crear:

- [ ] Guía de gestión básica
- [ ] Cómo actualizar variables
- [ ] Cómo hacer backups
- [ ] Cómo ver logs
- [ ] Contactos de soporte (si aplica)

---

## 🔐 Seguridad

### Después de Transferir:

1. **Eliminar tu acceso:**
   - Una vez transferido, elimina tu acceso como admin
   - Asegúrate de que solo el cliente tenga control

2. **Cambiar contraseñas:**
   - El cliente debe cambiar todas las contraseñas
   - Especialmente email y Cloudinary

3. **Verificar accesos:**
   - El cliente debe verificar que puede acceder a todo
   - Probar hacer cambios y deploys

---

## 📧 Contacto de Soporte

Si el cliente necesita ayuda:

- **Railway:** https://railway.app/help
- **Vercel:** https://vercel.com/support
- **Hostinger:** https://hpanel.hostinger.com/support

---

## ⚠️ Importante

1. **Backup antes de transferir:**
   - Haz un backup de la base de datos
   - Guarda todas las variables de entorno
   - Documenta todo

2. **No elimines tu cuenta inmediatamente:**
   - Espera a que el cliente confirme que todo funciona
   - Mantén acceso temporal por si hay problemas

3. **Documenta todo:**
   - Todas las credenciales
   - Todas las configuraciones
   - Procesos importantes

