import { Router } from 'express';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';
import * as likeController from '../controllers/like.controller';

const router = Router();

router.use(authenticateToken);
router.use(requireProfile);

// Dar like
router.post('/:profileId', likeController.likeProfile);

// Quitar like
router.delete('/:profileId', likeController.unlikeProfile);

// Obtener likes enviados
router.get('/sent', likeController.getSentLikes);

// Obtener likes recibidos
router.get('/received', likeController.getReceivedLikes);

// Verificar match mutuo
router.get('/check/:profileId', likeController.checkMatch);

export default router;

