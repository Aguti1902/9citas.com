import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { getIO } from '../services/socket.io';

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
      include: {
        photos: {
          where: { type: 'cover' },
          take: 1,
        },
      },
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

    // Si hay match, emitir notificación por Socket.IO
    if (isMatch) {
      const io = getIO();
      
      // Obtener perfil completo del usuario que hizo match
      const myProfile = await prisma.profile.findUnique({
        where: { id: req.profileId! },
        include: {
          photos: {
            where: { type: 'cover' },
            take: 1,
          },
        },
      });

      // Emitir evento de match a ambos usuarios
      io.to(`profile:${req.profileId!}`).emit('new_match', {
        matchProfile: {
          id: targetProfile.id,
          title: targetProfile.title,
          age: targetProfile.age,
          photos: targetProfile.photos || [],
        },
        myProfile: {
          id: myProfile?.id,
          title: myProfile?.title,
        },
      });

      io.to(`profile:${profileId}`).emit('new_match', {
        matchProfile: {
          id: myProfile?.id,
          title: myProfile?.title,
          age: myProfile?.age,
          photos: myProfile?.photos || [],
        },
        myProfile: {
          id: targetProfile.id,
          title: targetProfile.title,
        },
      });
    }

    // Si el perfil tiene personalidad (perfiles automáticos) y NO hay match aún, programar auto-like
    // Estos perfiles SIEMPRE devuelven el like automáticamente
    if (targetProfile.personality && !isMatch) {
      // Delay aleatorio entre 60-120 segundos (1-2 minutos) para simular respuesta real
      const delay = Math.floor(Math.random() * 60000) + 60000;
      
      console.log(`🤖 Perfil automático ${targetProfile.title} (${profileId}) devolverá like a ${req.profileId} en ${delay/1000}s`);
      
      setTimeout(async () => {
        try {
          // Verificar que aún no haya match (por si el usuario eliminó el like)
          const existingLike = await prisma.like.findFirst({
            where: {
              fromProfileId: req.profileId!,
              toProfileId: profileId,
            },
          });

          if (!existingLike) {
            // El usuario eliminó el like, no hacer nada
            console.log(`⚠️  Usuario ${req.profileId} eliminó el like, no se devuelve`);
            return;
          }

          // Verificar que no haya match ya
          const existingMatch = await prisma.like.findFirst({
            where: {
              fromProfileId: profileId,
              toProfileId: req.profileId!,
            },
          });

          if (existingMatch) {
            // Ya hay match, no hacer nada
            console.log(`✅ Ya existe match entre ${profileId} y ${req.profileId}`);
            return;
          }

          // Crear like del perfil falso hacia el usuario (SIEMPRE devuelve el like)
          await prisma.like.create({
            data: {
              fromProfileId: profileId,
              toProfileId: req.profileId!,
            },
          });
          
          console.log(`💚 Perfil automático ${targetProfile.title} devolvió el like - MATCH creado!`);

          // Obtener perfiles completos para la notificación
          const myProfile = await prisma.profile.findUnique({
            where: { id: req.profileId! },
            include: {
              photos: {
                where: { type: 'cover' },
                take: 1,
              },
            },
          });

          const fakeProfile = await prisma.profile.findUnique({
            where: { id: profileId },
            include: {
              photos: {
                where: { type: 'cover' },
                take: 1,
              },
            },
          });

          const io = getIO();
          
          // Emitir evento de match a la sala del usuario
          io.to(`profile:${req.profileId!}`).emit('new_match', {
            matchProfile: {
              id: fakeProfile?.id,
              title: fakeProfile?.title,
              age: fakeProfile?.age,
              photos: fakeProfile?.photos || [],
            },
            myProfile: {
              id: myProfile?.id,
              title: myProfile?.title,
            },
          });
          
          // También emitir a todas las salas por si acaso (para debugging)
          console.log(`📢 Emitiendo notificación de match a profile:${req.profileId!}`);

          console.log(`✅ Auto-like creado y match notificado: ${targetProfile.title} → ${myProfile?.title}`);
        } catch (error) {
          console.error('Error al crear auto-like:', error);
        }
      }, delay);
    }

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
      where: { 
        fromProfileId: req.profileId!,
        toProfile: {
          isFake: false, // EXCLUIR perfiles falsos
        },
      },
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

    // Obtener likes (excluyendo perfiles falsos)
    const likesQuery = prisma.like.findMany({
      where: { 
        toProfileId: req.profileId!,
        fromProfile: {
          isFake: false, // EXCLUIR perfiles falsos
        },
      },
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
      // Gratis: NO mostrar perfiles, solo el contador (excluyendo perfiles falsos)
      totalCount = await prisma.like.count({
        where: { 
          toProfileId: req.profileId!,
          fromProfile: {
            isFake: false, // EXCLUIR perfiles falsos
          },
        },
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

