import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.middleware';
import { calculateDistance } from '../utils/distance.utils';
import { normalizeProfilesPhotos, normalizeProfilePhotos } from '../utils/photo.utils';

const prisma = new PrismaClient();

// Crear perfil
export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, aboutMe, lookingFor, age, orientation, gender, city, latitude, longitude, 
          height, bodyType, relationshipStatus, occupation, education, smoking, drinking,
          children, pets, zodiacSign, hobbies, languages } = req.body;

    // Verificar que no tenga ya un perfil
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Ya tienes un perfil creado' });
    }

    // Crear perfil
    const profile = await prisma.profile.create({
      data: {
        userId: req.userId,
        title,
        aboutMe,
        lookingFor,
        age,
        orientation,
        gender: gender || 'hombre', // Default si no se especifica
        city,
        latitude: latitude || null,
        longitude: longitude || null,
        height: height || null,
        bodyType: bodyType || null,
        relationshipStatus: relationshipStatus || null,
        occupation: occupation || null,
        education: education || null,
        smoking: smoking || null,
        drinking: drinking || null,
        children: children || null,
        pets: pets || null,
        zodiacSign: zodiacSign || null,
        hobbies: hobbies || [],
        languages: languages || ['Español'],
        isOnline: true,
      },
    });

    res.status(201).json({
      message: 'Perfil creado exitosamente',
      profile,
    });
  } catch (error) {
    console.error('Error al crear perfil:', error);
    res.status(500).json({ error: 'Error al crear perfil' });
  }
};

// Obtener perfil propio
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
      include: {
        photos: true,
        user: {
          select: {
            email: true,
            subscription: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, aboutMe, lookingFor, age, orientation, gender, city, latitude, longitude,
          height, bodyType, relationshipStatus, occupation, education, smoking, drinking,
          children, pets, zodiacSign, hobbies, languages } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId: req.userId },
      data: {
        title,
        aboutMe,
        lookingFor,
        age,
        orientation,
        gender, // Permitir cambiar género
        city,
        latitude: latitude || null,
        longitude: longitude || null,
        height: height || null,
        bodyType: bodyType || null,
        relationshipStatus: relationshipStatus || null,
        occupation: occupation || null,
        education: education || null,
        smoking: smoking || null,
        drinking: drinking || null,
        children: children || null,
        pets: pets || null,
        zodiacSign: zodiacSign || null,
        hobbies: hobbies || [],
        languages: languages || [],
        lastSeenAt: new Date(),
      },
    });

    res.json({
      message: 'Perfil actualizado exitosamente',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Buscar perfiles (navegar) - SIMPLIFICADO AL MÁXIMO
export const searchProfiles = async (req: AuthRequest, res: Response) => {
  try {
    const { filter, city, ageMin, ageMax, distanceMin, distanceMax, page = 1, limit = 20, gender } = req.query;

    // Obtener perfil actual
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

    if (!myProfile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const isPlus = myProfile.user?.subscription?.isActive || false;

    // Verificar género y orientación
    if (!myProfile.gender || !myProfile.orientation) {
      return res.status(400).json({ 
        error: 'Tu perfil no tiene género u orientación definidos. Por favor, actualiza tu perfil.',
      });
    }

    // NUEVA LÓGICA: Determinar qué género buscar
    let targetGender: string | null = null;
    
    if (myProfile.orientation === 'hetero') {
      // USUARIOS HETERO:
      if (isPlus && gender) {
        // 9PLUS: Puede filtrar por género específico
        targetGender = gender as string;
      } else if (isPlus && !gender) {
        // 9PLUS sin filtro: Ver TODOS los géneros (hombres + mujeres)
        targetGender = null;
      } else {
        // FREE: Ver TODOS los géneros (hombres + mujeres) - NO PUEDEN FILTRAR
        targetGender = null;
      }
    } else if (myProfile.orientation === 'gay') {
      // GAY: Solo mismo género (lógica original)
      targetGender = myProfile.gender;
    } else {
      return res.status(400).json({ error: 'Orientación no válida' });
    }

    // Obtener IDs bloqueados y likes
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerProfileId: req.profileId! },
          { blockedProfileId: req.profileId! },
        ],
      },
    });
    const blockedIds = blocks.map(b =>
      b.blockerProfileId === req.profileId ? b.blockedProfileId : b.blockerProfileId
    );

    // IMPORTANTE: NO excluir perfiles con like para que se repitan
    // Los usuarios gratuitos solo ven 50 perfiles, necesitan que se repitan
    const excludedIds = [req.profileId!, ...blockedIds];

    console.log(`\n🔍 BÚSQUEDA: ${myProfile.title} (${myProfile.gender} ${myProfile.orientation})`);
    console.log(`   Buscando: ${targetGender || 'TODOS LOS GÉNEROS'} ${myProfile.orientation}`);
    console.log(`   Excluir: ${excludedIds.length} perfiles (propio + bloqueados)`);
    console.log(`   Plan: ${isPlus ? '9PLUS' : 'FREE'}`);

    // Construir where SIMPLE
    const where: any = {
      id: { notIn: excludedIds },
      orientation: myProfile.orientation,
      isFake: false, // Solo perfiles reales
      photos: {
        some: {
          type: 'cover',
        },
      },
    };

    // Agregar filtro de género SOLO si targetGender está definido
    if (targetGender) {
      where.gender = targetGender;
    }

    // Filtros solo para 9Plus
    if (isPlus) {
      if (city) where.city = city;
      if (ageMin || ageMax) {
        where.age = {};
        if (ageMin) where.age.gte = parseInt(ageMin as string);
        if (ageMax) where.age.lte = parseInt(ageMax as string);
      }
      if (filter === 'online') {
        // ONLINE: Solo usuarios conectados AHORA (isOnline = true)
        where.isOnline = true;
      }
    }

    // Buscar perfiles
    let profiles = await prisma.profile.findMany({
      where,
      include: {
        photos: {
          where: { type: 'cover' },
          take: 1,
        },
        receivedLikes: {
          where: { fromProfileId: req.profileId! },
        },
      },
      orderBy: {
        lastSeenAt: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: isPlus ? Number(limit) * 3 : Math.min(Number(limit) * 3, 150),
    });

    // Filtrar perfiles sin foto de portada
    profiles = profiles.filter(profile => profile.photos && profile.photos.length > 0);

    console.log(`   ✅ Encontrados: ${profiles.length} perfiles`);

    // Calcular distancia (solo si hay coordenadas)
    const profilesWithDistance = profiles.map(profile => {
      const distance =
        myProfile.latitude &&
        myProfile.longitude &&
        profile.latitude &&
        profile.longitude
          ? calculateDistance(
              myProfile.latitude,
              myProfile.longitude,
              profile.latitude,
              profile.longitude
            )
          : null;

      return {
        ...profile,
        distance,
        isLiked: profile.receivedLikes.length > 0,
        receivedLikes: undefined,
      };
    });

    // Filtrar por distancia (solo 9Plus)
    let filteredProfiles = profilesWithDistance;
    if (isPlus && (distanceMin !== undefined || distanceMax !== undefined)) {
      const min = distanceMin !== undefined ? parseInt(distanceMin as string) : 0;
      const max = distanceMax !== undefined ? parseInt(distanceMax as string) : 500;
      filteredProfiles = profilesWithDistance.filter(profile => {
        if (profile.distance === null) return false;
        return profile.distance >= min && profile.distance <= max;
      });
    }

    // Eliminar duplicados
    const uniqueProfiles = filteredProfiles.filter((profile, index, self) =>
      index === self.findIndex(p => p.id === profile.id)
    );

    // Ordenar por distancia: más cercano primero (ascendente)
    uniqueProfiles.sort((a, b) => {
      // Perfiles con distancia van primero
      if (a.distance === null && b.distance === null) return 0
      if (a.distance === null) return 1 // Sin distancia al final
      if (b.distance === null) return -1 // Con distancia primero
      return a.distance - b.distance // Ordenar de menor a mayor distancia
    })

    // Limitar resultados (50 para gratuitos)
    const maxProfilesForFree = 50;
    const finalProfiles = uniqueProfiles.slice(0, isPlus ? Number(limit) : Math.min(Number(limit), maxProfilesForFree));

    // Normalizar URLs de fotos
    const normalizedProfiles = normalizeProfilesPhotos(finalProfiles);

    console.log(`   📊 Resultado final: ${finalProfiles.length} perfiles\n`);

    res.json({
      profiles: normalizedProfiles,
      hasMore: uniqueProfiles.length > finalProfiles.length,
      isPlus,
    });
  } catch (error: any) {
    console.error('❌ ERROR al buscar perfiles:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al buscar perfiles',
      message: error.message || 'Error desconocido',
    });
  }
};

// Obtener perfil por ID
export const getProfileById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar que no esté bloqueado
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerProfileId: req.profileId!, blockedProfileId: id },
          { blockerProfileId: id, blockedProfileId: req.profileId! },
        ],
      },
    });

    if (block) {
      return res.status(403).json({ error: 'No puedes ver este perfil' });
    }

    // Obtener perfil
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        photos: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Verificar que no sea fake (a menos que sea el propio perfil)
    if (profile.isFake && profile.userId !== req.userId) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Verificar acceso a fotos privadas
    const privatePhotoAccess = await prisma.privatePhotoAccess.findUnique({
      where: {
        ownerProfileId_viewerProfileId: {
          ownerProfileId: id,
          viewerProfileId: req.profileId!,
        },
      },
    });

    const hasPrivateAccess = privatePhotoAccess?.status === 'granted';

    // Verificar si hay match
    const match = await prisma.like.findFirst({
      where: {
        OR: [
          { fromProfileId: req.profileId!, toProfileId: id },
          { fromProfileId: id, toProfileId: req.profileId! },
        ],
      },
    });

    const isLiked = await prisma.like.findFirst({
      where: {
        fromProfileId: req.profileId!,
        toProfileId: id,
      },
    });

    // Normalizar fotos
    const normalizedProfile = normalizeProfilePhotos(profile);

    res.json({
      ...normalizedProfile,
      isLiked: !!isLiked,
      hasMatch: !!match,
      privatePhotoAccess: {
        hasAccess: hasPrivateAccess,
        status: privatePhotoAccess?.status || null,
      },
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar ubicación
export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { city, latitude, longitude } = req.body;

    await prisma.profile.update({
      where: { userId: req.userId },
      data: {
        city,
        latitude: latitude || null,
        longitude: longitude || null,
        lastSeenAt: new Date(),
      },
    });

    res.json({ message: 'Ubicación actualizada' });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
};
