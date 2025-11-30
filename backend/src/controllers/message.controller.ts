import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Enviar mensaje
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { toProfileId, text, photoId, location } = req.body;

    if (!toProfileId) {
      return res.status(400).json({ error: 'Destinatario requerido' });
    }

    if (!text && !photoId && !location) {
      return res.status(400).json({ error: 'El mensaje debe tener contenido' });
    }

    // Verificar que el destinatario existe
    const toProfile = await prisma.profile.findUnique({
      where: { id: toProfileId },
    });

    if (!toProfile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Verificar misma orientación
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

    if (toProfile.orientation !== myProfile?.orientation) {
      return res.status(403).json({ error: 'No puedes enviar mensajes a este perfil' });
    }

    // Verificar que no esté bloqueado
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerProfileId: req.profileId!, blockedProfileId: toProfileId },
          { blockerProfileId: toProfileId, blockedProfileId: req.profileId! },
        ],
      },
    });

    if (block) {
      return res.status(403).json({ error: 'No puedes enviar mensajes a este perfil' });
    }

    // Verificar restricción de ciudad para usuarios gratis
    const isPlus = myProfile?.user?.subscription?.isActive || false;
    if (!isPlus && myProfile?.city !== toProfile.city) {
      return res.status(403).json({
        error: 'Solo puedes chatear con usuarios de tu ciudad. Suscríbete a 9Plus para chatear con cualquiera.',
        requiresPremium: true,
      });
    }

    // Verificar match mutuo para usuarios FREE
    if (!isPlus) {
      // Verificar que AMBOS se hayan dado like (match mutuo)
      const myLike = await prisma.like.findFirst({
        where: {
          fromProfileId: req.profileId!,
          toProfileId: toProfileId,
        },
      });

      const theirLike = await prisma.like.findFirst({
        where: {
          fromProfileId: toProfileId,
          toProfileId: req.profileId!,
        },
      });

      if (!myLike || !theirLike) {
        return res.status(403).json({
          error: 'Solo puedes chatear con usuarios que también te hayan dado "Me gusta". Suscríbete a 9Plus para chatear con cualquiera.',
          requiresPremium: true,
          requiresMatch: true,
        });
      }
    }

    // Crear mensaje
    const message = await prisma.message.create({
      data: {
        fromProfileId: req.profileId!,
        toProfileId,
        text: text || null,
        photoId: photoId || null,
        location: location || null,
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
        photo: true,
      },
    });

    // TODO: Emitir evento de Socket.IO para enviar mensaje en tiempo real

    res.status(201).json({
      message: 'Mensaje enviado',
      data: message,
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

// Obtener conversaciones
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    // Obtener últimos mensajes de cada conversación
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromProfileId: req.profileId! },
          { toProfileId: req.profileId! },
        ],
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

    // Agrupar por conversación
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const otherProfileId =
        message.fromProfileId === req.profileId
          ? message.toProfileId
          : message.fromProfileId;

      if (!conversationsMap.has(otherProfileId)) {
        const otherProfile =
          message.fromProfileId === req.profileId
            ? message.toProfile
            : message.fromProfile;

        conversationsMap.set(otherProfileId, {
          profile: otherProfile,
          lastMessage: message,
          unreadCount: 0,
        });
      }
    });

    // Contar mensajes no leídos
    for (const [profileId, conversation] of conversationsMap.entries()) {
      const unreadCount = await prisma.message.count({
        where: {
          fromProfileId: profileId,
          toProfileId: req.profileId!,
          isRead: false,
        },
      });
      conversation.unreadCount = unreadCount;
    }

    const conversations = Array.from(conversationsMap.values());

    res.json({ conversations });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

// Obtener mensajes con un usuario
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;
    const { limit = 50, before } = req.query;

    const whereClause: any = {
      OR: [
        { fromProfileId: req.profileId!, toProfileId: profileId },
        { fromProfileId: profileId, toProfileId: req.profileId! },
      ],
    };

    if (before) {
      whereClause.createdAt = { lt: new Date(before as string) };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        fromProfile: {
          include: {
            photos: {
              where: { type: 'cover' },
              take: 1,
            },
          },
        },
        photo: true,
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// Marcar mensajes como leídos
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    await prisma.message.updateMany({
      where: {
        fromProfileId: profileId,
        toProfileId: req.profileId!,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({ message: 'Mensajes marcados como leídos' });
  } catch (error) {
    console.error('Error al marcar mensajes:', error);
    res.status(500).json({ error: 'Error al marcar mensajes' });
  }
};

// Eliminar conversación
export const deleteConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;

    // Eliminar todos los mensajes de la conversación
    await prisma.message.deleteMany({
      where: {
        OR: [
          { fromProfileId: req.profileId!, toProfileId: profileId },
          { fromProfileId: profileId, toProfileId: req.profileId! },
        ],
      },
    });

    res.json({ message: 'Conversación eliminada' });
  } catch (error) {
    console.error('Error al eliminar conversación:', error);
    res.status(500).json({ error: 'Error al eliminar conversación' });
  }
};

