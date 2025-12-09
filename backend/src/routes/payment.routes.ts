import { Router } from 'express';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';
import {
  createSubscriptionCheckout,
  createRoamCheckout,
  stripeWebhook,
  createCustomerPortalSession,
} from '../controllers/payment.controller';

const router = Router();

// Webhook de Stripe (NO requiere autenticación, usa firma de Stripe)
router.post('/webhook', stripeWebhook);

// Rutas protegidas
router.use(authenticateToken);

// Crear checkout para suscripción
router.post('/subscription/checkout', createSubscriptionCheckout);

// Crear checkout para RoAM
router.post('/roam/checkout', requireProfile, createRoamCheckout);

// Crear sesión del portal de cliente (gestionar suscripción)
router.post('/customer-portal', createCustomerPortalSession);

export default router;

