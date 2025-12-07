import { Router } from 'express';
import { createReport, getReportCount, checkIfReported } from '../controllers/report.controller';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';

const router = Router();

// Crear una denuncia (requiere perfil)
router.post('/', authenticateToken, requireProfile, createReport);

// Obtener número de denuncias de un perfil
router.get('/count/:profileId', getReportCount);

// Verificar si el usuario actual ya denunció un perfil (requiere perfil)
router.get('/check/:profileId', authenticateToken, requireProfile, checkIfReported);

export default router;

