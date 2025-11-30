import { Router } from 'express';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';
import * as blockController from '../controllers/block.controller';

const router = Router();

router.use(authenticateToken);
router.use(requireProfile);

// Bloquear usuario
router.post('/:profileId', blockController.blockProfile);

// Desbloquear usuario
router.delete('/:profileId', blockController.unblockProfile);

// Obtener usuarios bloqueados
router.get('/', blockController.getBlockedProfiles);

export default router;

