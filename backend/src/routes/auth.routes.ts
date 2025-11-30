import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('orientation')
      .isIn(['hetero', 'gay'])
      .withMessage('Orientación debe ser hetero o gay'),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
  ],
  authController.login
);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authenticateToken, authController.logout);

// Verificar email
router.get('/verify-email/:token', authController.verifyEmail);

// Reenviar email de verificación
router.post('/resend-verification', authController.resendVerificationEmail);

// Obtener usuario actual
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;

