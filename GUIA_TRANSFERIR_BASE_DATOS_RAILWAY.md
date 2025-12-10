# 🔄 Guía: Transferir Base de Datos de Railway a Otra Cuenta

## 📋 Opciones para Transferir

Tienes dos opciones principales para transferir la base de datos:

---

## ✅ OPCIÓN 1: Transferir Proyecto Completo (RECOMENDADO)

Esta es la opción más simple si la base de datos PostgreSQL está en el mismo proyecto que el backend.

### Paso 1: Acceder a Railway

1. Ve a **https://railway.app**
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto que contiene la base de datos

### Paso 2: Transferir el Proyecto

1. En el proyecto, ve a la pestaña **"Settings"** (Configuración)
2. Busca la sección **"Transfer Project"** o **"Transfer to Team/Account"**
3. Haz clic en **"Transfer Project"**
4. Selecciona una de estas opciones:
   - **Email del cliente**: Ingresa el email de la cuenta de Railway de tu cliente
   - **Team/Account**: Si tu cliente tiene un team, selecciónalo
5. Confirma la transferencia
6. Tu cliente recibirá una notificación para aceptar la transferencia

### Paso 3: Cliente acepta la transferencia

1. Tu cliente debe iniciar sesión en Railway
2. Aceptar la invitación/transferencia
3. El proyecto (y la base de datos) aparecerá en su cuenta
4. **Tu cliente ahora será el dueño y pagará todos los servicios**

### ✅ Ventajas:
- Mantiene todas las configuraciones
- No hay downtime
- La base de datos sigue funcionando inmediatamente
- Variables de entorno se transfieren automáticamente

---

## 📦 OPCIÓN 2: Exportar e Importar Base de Datos

Si prefieres crear una base de datos nueva en la cuenta del cliente y migrar solo los datos.

### Paso 1: Exportar Base de Datos (Tu Cuenta)

1. Ve a tu proyecto en Railway
2. Abre el servicio PostgreSQL
3. Ve a la pestaña **"Connect"** o **"Variables"**
4. Copia el **`DATABASE_URL`**

5. Desde tu terminal local, ejecuta:

```bash
# Instalar PostgreSQL client si no lo tienes
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Exportar la base de datos
pg_dump "TU_DATABASE_URL_DE_RAILWAY" > backup_9citas.sql
```

**Ejemplo:**
```bash
pg_dump "postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway" > backup_9citas.sql
```

6. Descarga el archivo `backup_9citas.sql` (debe estar en tu carpeta actual)

### Paso 2: Cliente Crea Nueva Base de Datos

1. Tu cliente inicia sesión en Railway con su cuenta
2. Crea un nuevo proyecto
3. Agrega un servicio **PostgreSQL**
4. Espera a que se cree
5. Ve a la pestaña **"Connect"** o **"Variables"**
6. Copia el nuevo **`DATABASE_URL`**

### Paso 3: Importar Base de Datos (Cliente)

1. El cliente ejecuta desde su terminal:

```bash
# Importar la base de datos
psql "NUEVO_DATABASE_URL_DEL_CLIENTE" < backup_9citas.sql
```

**Ejemplo:**
```bash
psql "postgresql://postgres:newpassword@containers-us-west-yyy.railway.app:5432/railway" < backup_9citas.sql
```

### Paso 4: Actualizar Variables de Entorno

El cliente debe actualizar el `DATABASE_URL` en su proyecto del backend con el nuevo valor.

### ✅ Ventajas:
- Cliente tiene control total desde el inicio
- Puedes mantener tu proyecto original (backup)

### ⚠️ Desventajas:
- Requiere downtime durante la migración
- Hay que actualizar variables de entorno manualmente
- Más pasos y posibilidad de errores

---

## 🔐 Paso Adicional: Transferir Variables de Entorno

Después de transferir, tu cliente debe revisar y actualizar estas variables en Railway:

### Variables que DEBE actualizar:

1. **`DATABASE_URL`** - Si usó la Opción 2, actualizar con la nueva URL
2. **`STRIPE_SECRET_KEY`** - Tu cliente debe usar SUS propias claves de Stripe
3. **`STRIPE_PUBLISHABLE_KEY`** - Clave pública de Stripe del cliente
4. **`STRIPE_WEBHOOK_SECRET`** - Nuevo secret del webhook del cliente
5. **`JWT_ACCESS_SECRET`** - Puede mantener el mismo o generar uno nuevo
6. **`JWT_REFRESH_SECRET`** - Puede mantener el mismo o generar uno nuevo

### Variables que puede mantener igual:

- `FRONTEND_URL` (si el dominio es el mismo)
- `PORT`
- `NODE_ENV`

---

## 📝 Checklist de Transferencia

### Antes de Transferir:

- [ ] Hacer backup de la base de datos
- [ ] Anotar todas las variables de entorno actuales
- [ ] Documentar configuraciones especiales
- [ ] Notificar al cliente sobre la transferencia

### Después de Transferir:

- [ ] Cliente verifica que el proyecto aparece en su cuenta
- [ ] Cliente actualiza variables de entorno (especialmente Stripe)
- [ ] Cliente prueba que la aplicación funciona
- [ ] Verificar que el webhook de Stripe funciona con la nueva cuenta
- [ ] Cliente actualiza método de pago en Railway

---

## 💰 Importante: Método de Pago

**Después de transferir, tu cliente debe:**

1. Ir a Railway → Settings → Billing
2. Agregar su método de pago
3. Railway empezará a cobrar a su tarjeta automáticamente

---

## 🔄 Alternativa: Usar Railway Teams

Si ambos trabajáis juntos, puedes:

1. Crear un **Team** en Railway
2. Invitar al cliente al team
3. Mover el proyecto al team
4. El cliente agrega su método de pago al team
5. Ambos podéis acceder, pero el cliente paga

---

## ⚠️ Advertencias Importantes

1. **Stripe**: El cliente DEBE crear su propia cuenta de Stripe y usar sus propias claves
2. **Webhooks**: Debe configurar nuevos webhooks con las claves del cliente
3. **Backup**: Siempre haz un backup antes de transferir
4. **Downtime**: Si usas la Opción 2, habrá downtime durante la migración
5. **Precios**: Railway cobrará al cliente según su plan (no se transfiere ningún plan existente)

---

## 📞 Soporte

Si tienes problemas:
- Documentación de Railway: https://docs.railway.app
- Soporte de Railway: support@railway.app

---

## ✅ Resumen Rápido (Opción 1 - Recomendada)

1. Railway → Tu Proyecto → Settings → Transfer Project
2. Ingresa email del cliente
3. Cliente acepta transferencia
4. Cliente agrega método de pago
5. Cliente actualiza variables de Stripe
6. ¡Listo! Cliente paga todo desde ahora

