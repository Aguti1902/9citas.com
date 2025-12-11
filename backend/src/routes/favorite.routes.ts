import { Router } from 'express';
import { authenticateToken, requireProfile, require9Plus } from '../middleware/auth.middleware';
import * as favoriteController from '../controllers/favorite.controller';

const router = Router();

router.use(authenticateToken);
router.use(requireProfile);

// Agregar a favoritos (solo 9Plus)
router.post('/:profileId', require9Plus, favoriteController.addFavorite);

// Quitar de favoritos (solo 9Plus)
router.delete('/:profileId', require9Plus, favoriteController.removeFavorite);

// Obtener favoritos (solo 9Plus)
router.get('/', require9Plus, favoriteController.getFavorites);

export default router;

