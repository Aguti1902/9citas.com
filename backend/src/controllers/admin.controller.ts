import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateFakeProfiles } from '../prisma/seedHelpers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Login de admin
export const login = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Contraseña requerida' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT para admin
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: 'Login exitoso',
    });
  } catch (error) {
    console.error('Error en login de admin:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener todos los perfiles
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            emailVerified: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            sentMessages: true,
            receivedMessages: true,
            sentLikes: true,
            receivedLikes: true,
            reportsReceived: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ profiles, total: profiles.length });
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

// Obtener todas las denuncias
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporterProfile: {
          include: {
            photos: {
              where: { type: 'cover' },
              take: 1,
            },
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        reportedProfile: {
          include: {
            photos: {
              where: { type: 'cover' },
              take: 1,
            },
            user: {
              select: {
                email: true,
              },
            },
            _count: {
              select: {
                reportsReceived: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ reports, total: reports.length });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({ error: 'Error al obtener denuncias' });
  }
};

// Eliminar usuario y su perfil
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar usuario (CASCADE eliminará el perfil y todo lo relacionado)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        id: user.id,
        email: user.email,
        profileTitle: user.profile?.title,
      },
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Eliminar denuncia
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ error: 'ID de denuncia requerido' });
    }

    await prisma.report.delete({
      where: { id: reportId },
    });

    res.json({
      success: true,
      message: 'Denuncia eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar denuncia:', error);
    res.status(500).json({ error: 'Error al eliminar denuncia' });
  }
};

// Regenerar perfiles falsos
export const regenerateFakeProfiles = async (req: Request, res: Response) => {
  try {
    // Eliminar perfiles falsos existentes
    await prisma.profile.deleteMany({
      where: { isFake: true },
    });

    // Generar nuevos perfiles falsos
    const count = Math.floor(Math.random() * 200) + 200; // 200-400 perfiles
    await generateFakeProfiles(count);

    res.json({ message: `${count} perfiles falsos generados exitosamente` });
  } catch (error) {
    console.error('Error al regenerar perfiles falsos:', error);
    res.status(500).json({ error: 'Error al regenerar perfiles falsos' });
  }
};

// Eliminar perfiles falsos
export const deleteFakeProfiles = async (req: Request, res: Response) => {
  try {
    const result = await prisma.profile.deleteMany({
      where: { isFake: true },
    });

    res.json({ message: `${result.count} perfiles falsos eliminados` });
  } catch (error) {
    console.error('Error al eliminar perfiles falsos:', error);
    res.status(500).json({ error: 'Error al eliminar perfiles falsos' });
  }
};

// Obtener estadísticas
export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalProfiles,
      fakeProfiles,
      realProfiles,
      verifiedUsers,
      unverifiedUsers,
      heteroProfiles,
      gayProfiles,
      totalMessages,
      totalLikes,
      totalFavorites,
      totalReports,
      totalBlocks,
      activeSubscriptions,
      onlineUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.profile.count({ where: { isFake: true } }),
      prisma.profile.count({ where: { isFake: false } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { emailVerified: false } }),
      prisma.profile.count({ where: { orientation: 'hetero' } }),
      prisma.profile.count({ where: { orientation: 'gay' } }),
      prisma.message.count(),
      prisma.like.count(),
      prisma.favorite.count(),
      prisma.report.count(),
      prisma.block.count(),
      prisma.subscription.count({ where: { isActive: true } }),
      prisma.profile.count({ where: { isOnline: true } }),
    ]);

    // Obtener registros recientes (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Obtener usuarios más reportados
    const mostReportedProfiles = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        photos: {
          where: { type: 'cover' },
          take: 1,
        },
        _count: {
          select: {
            reportsReceived: true,
          },
        },
      },
      orderBy: {
        reportsReceived: {
          _count: 'desc',
        },
      },
      take: 5,
      where: {
        reportsReceived: {
          some: {},
        },
      },
    });

    res.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        recent: recentUsers,
        online: onlineUsers,
      },
      profiles: {
        total: totalProfiles,
        real: realProfiles,
        fake: fakeProfiles,
        hetero: heteroProfiles,
        gay: gayProfiles,
      },
      activity: {
        messages: totalMessages,
        likes: totalLikes,
        favorites: totalFavorites,
        reports: totalReports,
        blocks: totalBlocks,
      },
      subscriptions: {
        active: activeSubscriptions,
      },
      mostReportedProfiles,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

