import { Router } from 'express';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';
import * as favoriteController from '../controllers/favorite.controller';

const router = Router();

router.use(authenticateToken);
router.use(requireProfile);

// Agregar a favoritos
router.post('/:profileId', favoriteController.addFavorite);

// Quitar de favoritos
router.delete('/:profileId', favoriteController.removeFavorite);

// Obtener favoritos
router.get('/', favoriteController.getFavorites);

export default router;

