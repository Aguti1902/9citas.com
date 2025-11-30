import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from '../utils/email.utils';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Registro
export const register = async (req: Request, res: Response) => {
  try {
    // Validar input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, orientation } = req.body;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario (email NO verificado inicialmente)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        emailVerified: false, // Cambiar a false para requerir verificación
      },
    });

    // Generar token de verificación
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // Enviar email de verificación
    await sendVerificationEmail(user.email, verificationToken);

    // Guardar orientación en una variable temporal (se usará al crear el perfil)
    // En una app real, esto se guardaría en una sesión o cache
    
    // NO generar tokens aún - el usuario debe verificar su email primero
    
    res.status(201).json({
      message: 'Usuario registrado. Por favor verifica tu email para continuar.',
      email: user.email,
      orientation, // Devolver orientación para usarla en el frontend
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
        subscription: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Actualizar estado online si tiene perfil
    if (user.profile) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          isOnline: true,
          lastSeenAt: new Date(),
        },
      });
    }

    // Generar tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        hasProfile: !!user.profile,
        profile: user.profile ? {
          id: user.profile.id,
          title: user.profile.title,
          orientation: user.profile.orientation,
          city: user.profile.city,
        } : null,
        subscription: user.subscription ? {
          isActive: user.subscription.isActive,
          plan: user.subscription.plan,
        } : null,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token requerido' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const newAccessToken = generateAccessToken(user.id);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({ error: 'Refresh token inválido' });
  }
};

// Logout
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // Marcar como offline
    if (req.profileId) {
      await prisma.profile.update({
        where: { id: req.profileId },
        data: {
          isOnline: false,
          lastSeenAt: new Date(),
        },
      });
    }

    // Limpiar cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

// Verificar email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Buscar el token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Verificar si el token ha expirado
    if (new Date() > verificationToken.expiresAt) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return res.status(400).json({ error: 'Token expirado. Por favor solicita uno nuevo.' });
    }

    // Verificar email del usuario
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    // Eliminar el token usado
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Enviar email de bienvenida
    await sendWelcomeEmail(verificationToken.user.email, verificationToken.user.email.split('@')[0]);

    // Generar tokens de sesión
    const accessToken = generateAccessToken(verificationToken.userId);
    const refreshToken = generateRefreshToken(verificationToken.userId);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Email verificado exitosamente',
      user: {
        id: verificationToken.user.id,
        email: verificationToken.user.email,
        emailVerified: true,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({ error: 'Error al verificar email' });
  }
};

// Reenviar email de verificación
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'El email ya está verificado' });
    }

    // Eliminar tokens anteriores
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Crear nuevo token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // Enviar email
    await sendVerificationEmail(user.email, verificationToken);

    res.json({ message: 'Email de verificación reenviado' });
  } catch (error) {
    console.error('Error al reenviar email:', error);
    res.status(500).json({ error: 'Error al reenviar email' });
  }
};

// Obtener usuario actual
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: {
          include: {
            photos: true,
          },
        },
        subscription: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      hasProfile: !!user.profile,
      profile: user.profile,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};

