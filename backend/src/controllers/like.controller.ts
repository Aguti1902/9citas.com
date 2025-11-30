import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Dar like
export const likeProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    if (profileId === req.profileId) {
      return res.status(400).json({ error: 'No puedes darte like a ti mismo' });
    }

    // Verificar que el perfil existe
    const targetProfile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!targetProfile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Verificar misma orientación
    const myProfile = await prisma.profile.findUnique({
      where: { id: req.profileId },
    });

    if (targetProfile.orientation !== myProfile?.orientation) {
      return res.status(403).json({ error: 'No puedes dar like a este perfil' });
    }

    // Verificar que no esté bloqueado
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerProfileId: req.profileId!, blockedProfileId: profileId },
          { blockerProfileId: profileId, blockedProfileId: req.profileId! },
        ],
      },
    });

    if (block) {
      return res.status(403).json({ error: 'No puedes dar like a este perfil' });
    }

    // Crear like (o ignorar si ya existe)
    const like = await prisma.like.upsert({
      where: {
        fromProfileId_toProfileId: {
          fromProfileId: req.profileId!,
          toProfileId: profileId,
        },
      },
      update: {},
      create: {
        fromProfileId: req.profileId!,
        toProfileId: profileId,
      },
    });

    // Verificar si hay MATCH (la otra persona ya me había dado like)
    const theirLike = await prisma.like.findFirst({
      where: {
        fromProfileId: profileId,
        toProfileId: req.profileId!,
      },
    });

    const isMatch = !!theirLike;

    res.status(201).json({
      message: isMatch ? '¡MATCH! 💕' : 'Like enviado',
      like,
      isMatch,
      matchProfile: isMatch ? targetProfile : null,
    });
  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({ error: 'Error al dar like' });
  }
};

// Quitar like
export const unlikeProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    await prisma.like.deleteMany({
      where: {
        fromProfileId: req.profileId!,
        toProfileId: profileId,
      },
    });

    res.json({ message: 'Like eliminado' });
  } catch (error) {
    console.error('Error al quitar like:', error);
    res.status(500).json({ error: 'Error al quitar like' });
  }
};

// Obtener likes enviados
export const getSentLikes = async (req: AuthRequest, res: Response) => {
  try {
    const likes = await prisma.like.findMany({
      where: { fromProfileId: req.profileId! },
      include: {
        toProfile: {
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

    res.json({ likes });
  } catch (error) {
    console.error('Error al obtener likes enviados:', error);
    res.status(500).json({ error: 'Error al obtener likes' });
  }
};

// Obtener likes recibidos
export const getReceivedLikes = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar suscripción
    const myProfile = await prisma.profile.findUnique({
      where: { id: req.profileId },
      include: {
        user: {
          include: {
            subscription: true,
          },
        },
      },
    });

    const isPlus = myProfile?.user?.subscription?.isActive || false;

    // Obtener likes
    const likesQuery = prisma.like.findMany({
      where: { toProfileId: req.profileId! },
      include: {
        fromProfile: {
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

    let likes;
    let totalCount = 0;
    
    if (isPlus) {
      // 9Plus: ver todos los likes con perfiles completos
      likes = await likesQuery;
      totalCount = likes.length;
    } else {
      // Gratis: NO mostrar perfiles, solo el contador
      totalCount = await prisma.like.count({
        where: { toProfileId: req.profileId! },
      });
      // Devolver array vacío para que el frontend muestre "bloqueado"
      likes = [];
    }

    res.json({
      likes,
      isPlus,
      total: totalCount,
      // Para FREE: mostrar solo los últimos 5 (pero sin perfiles visibles)
      freeLimit: isPlus ? undefined : 5,
    });
  } catch (error) {
    console.error('Error al obtener likes recibidos:', error);
    res.status(500).json({ error: 'Error al obtener likes' });
  }
};

// Verificar si hay match mutuo (ambos se han dado like)
export const checkMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    // Verificar mi like hacia ellos
    const myLike = await prisma.like.findFirst({
      where: {
        fromProfileId: req.profileId!,
        toProfileId: profileId,
      },
    });

    // Verificar su like hacia mí
    const theirLike = await prisma.like.findFirst({
      where: {
        fromProfileId: profileId,
        toProfileId: req.profileId!,
      },
    });

    const hasMatch = !!(myLike && theirLike);

    res.json({
      hasMatch,
      iLikedThem: !!myLike,
      theyLikedMe: !!theirLike,
    });
  } catch (error) {
    console.error('Error al verificar match:', error);
    res.status(500).json({ error: 'Error al verificar match' });
  }
};

