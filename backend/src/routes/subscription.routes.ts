import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import * as subscriptionController from '../controllers/subscription.controller';

const router = Router();

router.use(authenticateToken);

// Obtener suscripción actual
router.get('/', subscriptionController.getSubscription);

// Activar suscripción 9Plus (simulado)
router.post('/activate', subscriptionController.activateSubscription);

// Cancelar suscripción
router.post('/cancel', subscriptionController.cancelSubscription);

export default router;

