import { Router } from 'express';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';
import * as messageController from '../controllers/message.controller';

const router = Router();

router.use(authenticateToken);
router.use(requireProfile);

// Enviar mensaje
router.post('/', messageController.sendMessage);

// Obtener conversaciones
router.get('/conversations', messageController.getConversations);

// Obtener mensajes con un usuario
router.get('/:profileId', messageController.getMessages);

// Marcar mensajes como leídos
router.put('/:profileId/read', messageController.markAsRead);

// Eliminar conversación
router.delete('/:profileId', messageController.deleteConversation);

export default router;

