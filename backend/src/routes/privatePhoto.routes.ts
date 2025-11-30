import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  requestPrivatePhotoAccess,
  getAccessRequests,
  respondToAccessRequest,
  checkAccessStatus,
} from '../controllers/privatePhoto.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Solicitar acceso a fotos privadas de un perfil
router.post('/request/:profileId', requestPrivatePhotoAccess);

// Obtener solicitudes pendientes (que me han hecho)
router.get('/requests/received', getAccessRequests);

// Responder a una solicitud (aprobar/rechazar)
router.put('/requests/:requestId/:action', respondToAccessRequest); // action: 'grant' | 'reject'

// Verificar si tengo acceso a las fotos privadas de alguien
router.get('/check/:profileId', checkAccessStatus);

export default router;

