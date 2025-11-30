import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Todas las rutas requieren contraseña de admin
router.post('/profiles', authenticateAdmin, adminController.getAllProfiles);
router.post('/regenerate-fakes', authenticateAdmin, adminController.regenerateFakeProfiles);
router.post('/delete-fakes', authenticateAdmin, adminController.deleteFakeProfiles);
router.post('/stats', authenticateAdmin, adminController.getStats);

export default router;

