import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware'
import {
  activateRoam,
  getRoamStatus,
  finishRoam,
} from '../controllers/roam.controller'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// POST /api/roam/activate - Activar Roam
router.post('/activate', activateRoam)

// GET /api/roam/status - Obtener estado del Roam
router.get('/status', getRoamStatus)

// POST /api/roam/finish - Finalizar Roam manualmente
router.post('/finish', finishRoam)

export default router
