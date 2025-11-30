import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Agregar a favoritos
export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    if (profileId === req.profileId) {
      return res.status(400).json({ error: 'No puedes agregarte a ti mismo a favoritos' });
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        ownerProfileId_targetProfileId: {
          ownerProfileId: req.profileId!,
          targetProfileId: profileId,
        },
      },
      update: {},
      create: {
        ownerProfileId: req.profileId!,
        targetProfileId: profileId,
      },
    });

    res.status(201).json({
      message: 'Agregado a favoritos',
      favorite,
    });
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
};

// Quitar de favoritos
export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        ownerProfileId: req.profileId!,
        targetProfileId: profileId,
      },
    });

    res.json({ message: 'Eliminado de favoritos' });
  } catch (error) {
    console.error('Error al quitar favorito:', error);
    res.status(500).json({ error: 'Error al quitar favorito' });
  }
};

// Obtener favoritos
export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { ownerProfileId: req.profileId! },
      include: {
        targetProfile: {
          include: {
            photos: {
              where: { type: 'cover' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ favorites });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

