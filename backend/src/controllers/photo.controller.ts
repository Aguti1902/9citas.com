import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Subir foto
export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const { type } = req.body; // 'cover' | 'public' | 'private'

    if (!['cover', 'public', 'private'].includes(type)) {
      return res.status(400).json({ error: 'Tipo de foto inválido' });
    }

    // Verificar límites
    const existingPhotos = await prisma.photo.findMany({
      where: {
        profileId: req.profileId!,
        type,
      },
    });

    // Límites: 1 cover, 3 public, 4 private
    const limits: any = { cover: 1, public: 3, private: 4 };
    if (existingPhotos.length >= limits[type]) {
      // Eliminar archivo subido
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: `Ya has alcanzado el límite de ${limits[type]} foto(s) de tipo ${type}`,
      });
    }

    // Si es cover y ya existe una, eliminar la anterior
    if (type === 'cover' && existingPhotos.length > 0) {
      const oldPhoto = existingPhotos[0];
      fs.unlinkSync(path.join('uploads', path.basename(oldPhoto.url)));
      await prisma.photo.delete({ where: { id: oldPhoto.id } });
    }

    // Guardar en base de datos
    const photo = await prisma.photo.create({
      data: {
        profileId: req.profileId!,
        url: `/uploads/${req.file.filename}`,
        type,
      },
    });

    res.status(201).json({
      message: 'Foto subida exitosamente',
      photo,
    });
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({ error: 'Error al subir foto' });
  }
};

// Eliminar foto
export const deletePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }

    // Verificar que la foto pertenece al usuario
    if (photo.profileId !== req.profileId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta foto' });
    }

    // Eliminar archivo físico
    const filePath = path.join('uploads', path.basename(photo.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar de base de datos
    await prisma.photo.delete({ where: { id } });

    res.json({ message: 'Foto eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    res.status(500).json({ error: 'Error al eliminar foto' });
  }
};

// Obtener fotos del perfil
export const getProfilePhotos = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;
    const { includePrivate } = req.query;

    const whereClause: any = {
      profileId,
    };

    // Solo incluir fotos privadas si es el propio usuario
    if (!includePrivate || profileId !== req.profileId) {
      whereClause.type = {
        in: ['cover', 'public'],
      };
    }

    const photos = await prisma.photo.findMany({
      where: whereClause,
      orderBy: [
        { type: 'asc' }, // cover primero
        { createdAt: 'asc' },
      ],
    });

    res.json({ photos });
  } catch (error) {
    console.error('Error al obtener fotos:', error);
    res.status(500).json({ error: 'Error al obtener fotos' });
  }
};

