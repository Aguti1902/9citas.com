# 🎯 Guía Paso a Paso: Configurar Stripe para 9citas.com

## 📋 Índice
1. [Crear cuenta en Stripe](#1-crear-cuenta-en-stripe)
2. [Obtener claves de API](#2-obtener-claves-de-api)
3. [Crear productos y precios](#3-crear-productos-y-precios)
4. [Configurar webhook](#4-configurar-webhook)
5. [Configurar variables de entorno en Railway](#5-configurar-variables-de-entorno-en-railway)
6. [Probar en modo test](#6-probar-en-modo-test)
7. [Activar en producción](#7-activar-en-producción)

---

## 1. Crear cuenta en Stripe

### Paso 1.1: Registrarse
1. Ve a: **https://stripe.com**
2. Click en **"Start now"** o **"Sign up"**
3. Completa el formulario:
   - Email
   - Contraseña
   - País: **España**
   - Tipo de negocio: **SaaS** o **Marketplace**
4. Confirma tu email

### Paso 1.2: Completar perfil
1. Ve a: **https://dashboard.stripe.com/settings/account**
2. Completa la información:
   - Nombre de la empresa: **9citas.com**
   - Descripción: **App de citas**
   - Dirección
   - Teléfono
   - Website: **https://9citas.com**

### Paso 1.3: Verificar cuenta
- Stripe puede pedirte verificar tu identidad
- Sigue las instrucciones en el dashboard

---

## 2. Obtener claves de API

### Paso 2.1: Claves de TEST (para desarrollo)

1. Ve a: **https://dashboard.stripe.com/test/apikeys**
2. Verás dos claves:
   - **Publishable key** (empieza con `pk_test_`)
   - **Secret key** (empieza con `sk_test_`)

3. **Copia ambas claves** y guárdalas en un lugar seguro

### Paso 2.2: Claves de PRODUCCIÓN (para cuando esté listo)

1. En el dashboard, cambia a **"Live mode"** (toggle arriba a la derecha)
2. Ve a: **https://dashboard.stripe.com/apikeys**
3. Copia las claves de producción:
   - **Publishable key** (empieza con `pk_live_`)
   - **Secret key** (empieza con `sk_live_`)

⚠️ **IMPORTANTE:** Por ahora solo usa las claves de TEST. Las de producción las usarás cuando todo funcione.

---

## 3. Crear productos y precios

### Paso 3.1: Suscripción 9Plus (5€/mes)

1. Ve a: **https://dashboard.stripe.com/test/products**
2. Click en **"+ Add product"**
3. Completa el formulario:

   **Información del producto:**
   - **Name:** `9Plus - Suscripción Mensual`
   - **Description:** `Acceso completo a todas las funciones premium de 9citas`

   **Precio:**
   - **Pricing model:** Selecciona **"Recurring"** (Recurrente)
   - **Price:** `5.00`
   - **Currency:** `EUR` (Euro)
   - **Billing period:** `Monthly` (Mensual)
   - **Price ID:** Se generará automáticamente (empieza con `price_`)

4. Click en **"Save product"**
5. **Copia el Price ID** (empieza con `price_`) - Lo necesitarás después

### Paso 3.2: RoAM - Boost 1 hora (6.49€)

1. Click en **"+ Add product"**
2. Completa:

   **Información del producto:**
   - **Name:** `RoAM Boost - 1 hora`
   - **Description:** `Aumenta tu visibilidad durante 1 hora`

   **Precio:**
   - **Pricing model:** Selecciona **"One-time"** (Una vez)
   - **Price:** `6.49`
   - **Currency:** `EUR`

3. Click en **"Save product"**
4. **Copia el Price ID**

### Paso 3.3: RoAM - Boost 2 horas (11.99€)

1. Click en **"+ Add product"**
2. Completa:

   - **Name:** `RoAM Boost - 2 horas`
   - **Description:** `Aumenta tu visibilidad durante 2 horas`
   - **Pricing model:** `One-time`
   - **Price:** `11.99`
   - **Currency:** `EUR`

3. Click en **"Save product"**
4. **Copia el Price ID**

### Paso 3.4: RoAM - Boost 4 horas (19.99€)

1. Click en **"+ Add product"**
2. Completa:

   - **Name:** `RoAM Boost - 4 horas`
   - **Description:** `Aumenta tu visibilidad durante 4 horas`
   - **Pricing model:** `One-time`
   - **Price:** `19.99`
   - **Currency:** `EUR`

3. Click en **"Save product"**
4. **Copia el Price ID**

### 📝 Resumen de Price IDs

Anota aquí tus Price IDs:

```
Suscripción 9Plus: price_________________
RoAM 1h:          price_________________
RoAM 2h:          price_________________
RoAM 4h:          price_________________
```

---

## 4. Configurar webhook

### Paso 4.1: Crear endpoint de webhook

1. Ve a: **https://dashboard.stripe.com/test/webhooks**
2. Click en **"+ Add endpoint"**
3. Completa:

   **Endpoint URL:**
   - Si tu backend está en Railway: 
     ```
     https://tu-backend.railway.app/api/payments/webhook
     ```
   - Si tu backend está en producción:
     ```
     https://9citas.com/api/payments/webhook
     ```
   - ⚠️ **IMPORTANTE:** Debe ser HTTPS y accesible públicamente

   **Description:** `9citas.com Webhook`

   **Events to send:** Selecciona estos eventos:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

4. Click en **"Add endpoint"**

### Paso 4.2: Obtener Signing Secret

1. Después de crear el endpoint, verás la página de detalles
2. Busca **"Signing secret"** (empieza con `whsec_`)
3. Click en **"Reveal"** para verlo
4. **Copia el Signing secret** - Lo necesitarás para Railway

⚠️ **IMPORTANTE:** Si cambias la URL del webhook, necesitarás un nuevo Signing Secret.

---

## 5. Configurar variables de entorno en Railway

### Paso 5.1: Acceder a Railway

1. Ve a: **https://railway.app**
2. Inicia sesión
3. Selecciona tu proyecto **9citas-backend**

### Paso 5.2: Agregar variables de entorno

1. Ve a la pestaña **"Variables"** de tu proyecto
2. Click en **"+ New Variable"**
3. Agrega estas variables una por una:

#### Variable 1: STRIPE_SECRET_KEY
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_...` (tu Secret Key de TEST)
- Click en **"Add"**

#### Variable 2: STRIPE_WEBHOOK_SECRET
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (tu Signing Secret del webhook)
- Click en **"Add"**

#### Variable 3: STRIPE_PRICE_ID_SUBSCRIPTION
- **Name:** `STRIPE_PRICE_ID_SUBSCRIPTION`
- **Value:** `price_...` (Price ID de la suscripción 9Plus)
- Click en **"Add"**

#### Variable 4: STRIPE_PRICE_ID_ROAM_1H
- **Name:** `STRIPE_PRICE_ID_ROAM_1H`
- **Value:** `price_...` (Price ID de RoAM 1h)
- Click en **"Add"**

#### Variable 5: STRIPE_PRICE_ID_ROAM_2H
- **Name:** `STRIPE_PRICE_ID_ROAM_2H`
- **Value:** `price_...` (Price ID de RoAM 2h)
- Click en **"Add"**

#### Variable 6: STRIPE_PRICE_ID_ROAM_4H
- **Name:** `STRIPE_PRICE_ID_ROAM_4H`
- **Value:** `price_...` (Price ID de RoAM 4h)
- Click en **"Add"**

#### Variable 7: FRONTEND_URL (si no existe)
- **Name:** `FRONTEND_URL`
- **Value:** `https://9citas.com,https://www.9citas.com`
- Click en **"Add"**

### Paso 5.3: Verificar variables

Tu lista de variables debe verse así:

```
✅ STRIPE_SECRET_KEY=sk_test_...
✅ STRIPE_WEBHOOK_SECRET=whsec_...
✅ STRIPE_PRICE_ID_SUBSCRIPTION=price_...
✅ STRIPE_PRICE_ID_ROAM_1H=price_...
✅ STRIPE_PRICE_ID_ROAM_2H=price_...
✅ STRIPE_PRICE_ID_ROAM_4H=price_...
✅ FRONTEND_URL=https://9citas.com,https://www.9citas.com
```

### Paso 5.4: Redesplegar

1. Después de agregar todas las variables, Railway debería redeplegar automáticamente
2. Si no, ve a la pestaña **"Deployments"** y haz click en **"Redeploy"**

---

## 6. Probar en modo test

### Paso 6.1: Verificar que el backend funciona

1. Ve a tu backend en Railway
2. Revisa los logs para ver si hay errores
3. Debe mostrar que Stripe está inicializado

### Paso 6.2: Probar suscripción 9Plus

1. Ve a tu app: **https://9citas.com/app/plus**
2. Click en **"Contratar 9Plus"**
3. Deberías ser redirigido a Stripe Checkout
4. Usa una tarjeta de prueba:
   - **Número:** `4242 4242 4242 4242`
   - **CVV:** `123` (cualquier 3 dígitos)
   - **Fecha:** Cualquier fecha futura (ej: `12/25`)
   - **Código postal:** `28001` (cualquier código válido)
5. Completa el pago
6. Deberías ser redirigido de vuelta a tu app
7. Verifica que tu suscripción esté activa

### Paso 6.3: Probar RoAM

1. Ve a la página de navegación
2. Click en el botón de **RoAM**
3. Click en **"Activar Roam - 6,49€"**
4. Deberías ser redirigido a Stripe Checkout
5. Usa la misma tarjeta de prueba
6. Completa el pago
7. Verifica que RoAM se active

### Paso 6.4: Verificar webhook

1. Ve a: **https://dashboard.stripe.com/test/webhooks**
2. Click en tu endpoint
3. Ve a la pestaña **"Events"**
4. Deberías ver eventos como:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - etc.

Si no ves eventos, verifica:
- Que la URL del webhook sea correcta
- Que el webhook sea accesible públicamente (HTTPS)
- Que el Signing Secret sea correcto

---

## 7. Activar en producción

### Paso 7.1: Cambiar a modo Live en Stripe

1. En el dashboard de Stripe, cambia a **"Live mode"** (toggle arriba a la derecha)
2. ⚠️ **IMPORTANTE:** Ahora estás en modo producción

### Paso 7.2: Crear productos en producción

Repite el paso 3, pero ahora en modo Live:
- Crea los mismos productos y precios
- Copia los nuevos Price IDs (serán diferentes a los de test)

### Paso 7.3: Configurar webhook en producción

1. Crea un nuevo endpoint de webhook en modo Live
2. URL: `https://9citas.com/api/payments/webhook`
3. Copia el nuevo Signing Secret

### Paso 7.4: Actualizar variables en Railway

Actualiza estas variables en Railway con los valores de producción:

```
STRIPE_SECRET_KEY=sk_live_... (clave de producción)
STRIPE_WEBHOOK_SECRET=whsec_... (nuevo secret de producción)
STRIPE_PRICE_ID_SUBSCRIPTION=price_... (nuevo price ID de producción)
STRIPE_PRICE_ID_ROAM_1H=price_... (nuevo price ID de producción)
STRIPE_PRICE_ID_ROAM_2H=price_... (nuevo price ID de producción)
STRIPE_PRICE_ID_ROAM_4H=price_... (nuevo price ID de producción)
```

### Paso 7.5: Probar con pago real pequeño

1. Haz una prueba con un pago real pequeño (ej: 0.50€)
2. Verifica que todo funcione
3. Si funciona, ya está listo para producción

---

## 🐛 Solución de Problemas

### Error: "No stripe-signature header"
- **Causa:** El webhook no está configurado correctamente
- **Solución:** 
  1. Verifica que la URL del webhook sea correcta
  2. Verifica que sea HTTPS
  3. Verifica que sea accesible públicamente

### Error: "Webhook secret no configurado"
- **Causa:** `STRIPE_WEBHOOK_SECRET` no está en Railway
- **Solución:** Agrega la variable en Railway

### Error: "Invalid API Key"
- **Causa:** La clave de API es incorrecta
- **Solución:** 
  1. Verifica que uses la clave correcta (test vs live)
  2. Verifica que no haya espacios extra
  3. Copia y pega de nuevo

### Los pagos no se procesan
- **Causa:** El webhook no está recibiendo eventos
- **Solución:**
  1. Ve a Stripe Dashboard → Webhooks → Tu endpoint → Events
  2. Verifica si hay errores
  3. Verifica que el webhook sea accesible
  4. Verifica que el Signing Secret sea correcto

### Error: "Price not found"
- **Causa:** El Price ID no existe o es incorrecto
- **Solución:**
  1. Verifica que el Price ID sea correcto
  2. Verifica que estés usando el modo correcto (test vs live)
  3. Verifica que el producto exista en Stripe

---

## ✅ Checklist Final

Antes de considerar que está todo configurado:

- [ ] Cuenta de Stripe creada y verificada
- [ ] Claves de API obtenidas (test y live)
- [ ] Productos y precios creados en Stripe (test y live)
- [ ] Webhook configurado (test y live)
- [ ] Variables de entorno configuradas en Railway
- [ ] Backend redesplegado
- [ ] Pruebas en modo test completadas
- [ ] Webhook recibiendo eventos correctamente
- [ ] Pruebas en producción completadas

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Railway
2. Revisa los eventos del webhook en Stripe Dashboard
3. Consulta la documentación: **https://stripe.com/docs**

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, Stripe estará completamente integrado y funcionando. Los usuarios podrán:
- ✅ Suscribirse a 9Plus (5€/mes)
- ✅ Comprar RoAM (6.49€, 11.99€, 19.99€)
- ✅ Gestionar sus suscripciones desde el portal de Stripe

