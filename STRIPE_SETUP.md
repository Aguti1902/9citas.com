# 💳 Configuración de Stripe para 9citas.com

## 📋 Requisitos Previos

1. Cuenta de Stripe (https://stripe.com)
2. Acceso al dashboard de Stripe
3. Variables de entorno configuradas

---

## 🔑 Paso 1: Obtener Claves de API

1. Ve a: https://dashboard.stripe.com/apikeys
2. Copia tu **Secret Key** (empieza con `sk_`)
3. Copia tu **Publishable Key** (empieza con `pk_`)

---

## 💰 Paso 2: Crear Productos y Precios en Stripe

### 2.1. Suscripción 9Plus (5€/mes)

1. Ve a: https://dashboard.stripe.com/products
2. Click en "Add product"
3. Configura:
   - **Name:** `9Plus - Suscripción Mensual`
   - **Description:** `Acceso completo a todas las funciones premium de 9citas`
   - **Pricing model:** `Recurring`
   - **Price:** `5.00 EUR`
   - **Billing period:** `Monthly`
4. Click en "Save product"
5. **Copia el Price ID** (empieza con `price_`)

### 2.2. RoAM - Boost 1 hora (6.49€)

1. Click en "Add product"
2. Configura:
   - **Name:** `RoAM Boost - 1 hora`
   - **Description:** `Aumenta tu visibilidad durante 1 hora`
   - **Pricing model:** `One-time`
   - **Price:** `6.49 EUR`
3. Click en "Save product"
4. **Copia el Price ID**

### 2.3. RoAM - Boost 2 horas (11.99€)

1. Click en "Add product"
2. Configura:
   - **Name:** `RoAM Boost - 2 horas`
   - **Description:** `Aumenta tu visibilidad durante 2 horas`
   - **Pricing model:** `One-time`
   - **Price:** `11.99 EUR`
3. Click en "Save product"
4. **Copia el Price ID**

### 2.4. RoAM - Boost 4 horas (19.99€)

1. Click en "Add product"
2. Configura:
   - **Name:** `RoAM Boost - 4 horas`
   - **Description:** `Aumenta tu visibilidad durante 4 horas`
   - **Pricing model:** `One-time`
   - **Price:** `19.99 EUR`
3. Click en "Save product"
4. **Copia el Price ID**

---

## 🔔 Paso 3: Configurar Webhook

1. Ve a: https://dashboard.stripe.com/webhooks
2. Click en "Add endpoint"
3. Configura:
   - **Endpoint URL:** `https://tu-dominio.com/api/payments/webhook`
     - Para Railway: `https://tu-backend.railway.app/api/payments/webhook`
     - Para producción: `https://9citas.com/api/payments/webhook`
   - **Description:** `9citas.com Webhook`
   - **Events to send:** Selecciona estos eventos:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Click en "Add endpoint"
5. **Copia el Signing secret** (empieza con `whsec_`)

---

## ⚙️ Paso 4: Configurar Variables de Entorno

### En Railway (Backend):

Agrega estas variables en tu proyecto de Railway:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_... (o sk_live_... en producción)
STRIPE_WEBHOOK_SECRET=whsec_...

# Precios de Stripe (Price IDs)
STRIPE_PRICE_ID_SUBSCRIPTION=price_...
STRIPE_PRICE_ID_ROAM_1H=price_...
STRIPE_PRICE_ID_ROAM_2H=price_...
STRIPE_PRICE_ID_ROAM_4H=price_...

# Frontend URL (para redirects después del pago)
FRONTEND_URL=https://9citas.com,https://www.9citas.com
```

### En Vercel (Frontend):

Agrega esta variable:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (o pk_live_... en producción)
```

---

## 🧪 Paso 5: Probar en Modo Test

1. Usa las claves de **test mode** (empiezan con `sk_test_` y `pk_test_`)
2. Usa tarjetas de prueba de Stripe:
   - **Tarjeta exitosa:** `4242 4242 4242 4242`
   - **CVV:** Cualquier 3 dígitos
   - **Fecha:** Cualquier fecha futura
   - **Código postal:** Cualquier código válido

3. Prueba:
   - Suscripción 9Plus
   - Compra de RoAM (1h, 2h, 4h)
   - Cancelación de suscripción

---

## 🚀 Paso 6: Activar en Producción

1. Cambia a **Live mode** en Stripe
2. Obtén las claves de producción (`sk_live_` y `pk_live_`)
3. Actualiza las variables de entorno en Railway y Vercel
4. Actualiza el webhook URL a tu dominio de producción
5. Prueba con una compra real pequeña

---

## 📝 Estructura de Precios

| Producto | Precio | Price ID Variable |
|----------|--------|-------------------|
| 9Plus (mensual) | 5.00€ | `STRIPE_PRICE_ID_SUBSCRIPTION` |
| RoAM 1h | 6.49€ | `STRIPE_PRICE_ID_ROAM_1H` |
| RoAM 2h | 11.99€ | `STRIPE_PRICE_ID_ROAM_2H` |
| RoAM 4h | 19.99€ | `STRIPE_PRICE_ID_ROAM_4H` |

---

## 🔍 Verificar Configuración

### Backend:

1. Verifica que las variables de entorno estén configuradas:
   ```bash
   echo $STRIPE_SECRET_KEY
   echo $STRIPE_WEBHOOK_SECRET
   ```

2. Verifica los logs del servidor al iniciar:
   - Debe mostrar que Stripe está inicializado

### Frontend:

1. Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté configurada
2. Abre la consola del navegador
3. Debe poder crear sesiones de checkout sin errores

---

## 🐛 Solución de Problemas

### Error: "No stripe-signature header"
- **Causa:** El webhook no está configurado correctamente
- **Solución:** Verifica que la URL del webhook sea correcta y accesible

### Error: "Webhook secret no configurado"
- **Causa:** `STRIPE_WEBHOOK_SECRET` no está en las variables de entorno
- **Solución:** Agrega la variable en Railway

### Error: "Invalid API Key"
- **Causa:** La clave de API es incorrecta o está en modo test/producción incorrecto
- **Solución:** Verifica que uses las claves correctas para cada entorno

### Los pagos no se procesan
- **Causa:** El webhook no está recibiendo eventos
- **Solución:** 
  1. Verifica los logs del webhook en Stripe Dashboard
  2. Verifica que el endpoint sea accesible públicamente
  3. Verifica que el webhook secret sea correcto

---

## 📚 Recursos

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Stripe creada
- [ ] Claves de API obtenidas (test y live)
- [ ] Productos y precios creados en Stripe
- [ ] Webhook configurado
- [ ] Variables de entorno configuradas en Railway
- [ ] Variables de entorno configuradas en Vercel
- [ ] Pruebas en modo test completadas
- [ ] Activado en producción
- [ ] Pruebas en producción completadas

