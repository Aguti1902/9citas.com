import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateFakeProfiles } from '../prisma/seedHelpers';

const prisma = new PrismaClient();

// Obtener todos los perfiles
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        photos: true,
        user: {
          select: {
            email: true,
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
      heteroProfiles,
      gayProfiles,
      totalMessages,
      totalLikes,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.profile.count({ where: { isFake: true } }),
      prisma.profile.count({ where: { isFake: false } }),
      prisma.profile.count({ where: { orientation: 'hetero' } }),
      prisma.profile.count({ where: { orientation: 'gay' } }),
      prisma.message.count(),
      prisma.like.count(),
      prisma.subscription.count({ where: { isActive: true } }),
    ]);

    res.json({
      totalUsers,
      totalProfiles,
      fakeProfiles,
      realProfiles,
      heteroProfiles,
      gayProfiles,
      totalMessages,
      totalLikes,
      activeSubscriptions,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

