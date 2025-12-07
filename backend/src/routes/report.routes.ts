import { Router } from 'express';
import { createReport, getReportCount, checkIfReported } from '../controllers/report.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Crear una denuncia
router.post('/', authenticateToken, createReport);

// Obtener número de denuncias de un perfil
router.get('/count/:profileId', getReportCount);

// Verificar si el usuario actual ya denunció un perfil
router.get('/check/:profileId', authenticateToken, checkIfReported);

export default router;

