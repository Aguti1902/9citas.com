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
      where: { id: req.profileId },
      include: {
        photos: true,
        user: {
          include: {
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

  const { title, aboutMe, lookingFor, age, city, latitude, longitude,
          height, bodyType, relationshipStatus, occupation, education, smoking, drinking,
          children, pets, zodiacSign, hobbies, languages } = req.body;

  const updatedProfile = await prisma.profile.update({
    where: { id: req.profileId },
    data: {
      ...(title && { title }),
      ...(aboutMe && { aboutMe }),
      ...(lookingFor && { lookingFor }),
      ...(age && { age }),
      ...(city && { city }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
      ...(height !== undefined && { height }),
      ...(bodyType && { bodyType }),
      ...(relationshipStatus && { relationshipStatus }),
      ...(occupation && { occupation }),
      ...(education && { education }),
      ...(smoking && { smoking }),
      ...(drinking && { drinking }),
      ...(children && { children }),
      ...(pets && { pets }),
      ...(zodiacSign && { zodiacSign }),
      ...(hobbies && { hobbies }),
      ...(languages && { languages }),
    },
    include: {
      photos: true,
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

// Buscar perfiles (navegar)
export const searchProfiles = async (req: AuthRequest, res: Response) => {
  try {
    const { filter, city, ageMin, ageMax, distanceMin, distanceMax, page = 1, limit = 20 } = req.query;

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

    // Obtener IDs bloqueados
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

    // Obtener IDs de perfiles a los que ya se ha dado like (para no mostrarlos)
    const sentLikes = await prisma.like.findMany({
      where: { fromProfileId: req.profileId! },
      select: { toProfileId: true },
    });
    const likedProfileIds = sentLikes.map(like => like.toProfileId);

    // Construir filtros base
    const whereClause: any = {
      id: { notIn: [req.profileId!, ...blockedIds, ...likedProfileIds] },
      orientation: myProfile.orientation, // Mismo orientation
    };

    // Lógica de matching según orientación y género
    // Heteros: solo ven del género opuesto que sean heteros
    // Gays: solo ven del mismo género que sean gays
    if (myProfile.orientation === 'hetero') {
      // Heteros solo ven del género opuesto
      if (myProfile.gender === 'hombre') {
        whereClause.gender = 'mujer'; // Hombres heteros ven mujeres
      } else if (myProfile.gender === 'mujer') {
        whereClause.gender = 'hombre'; // Mujeres heteras ven hombres
      } else {
        // Si no tiene género definido, no mostrar nada (o mostrar ambos)
        // Por seguridad, no mostrar nada si no está definido
        console.warn(`⚠️  Perfil ${myProfile.id} no tiene género definido. Orientation: ${myProfile.orientation}`);
        whereClause.gender = null; // Esto no mostrará ningún perfil
      }
    } else if (myProfile.orientation === 'gay') {
      // Gays solo ven del mismo género
      if (myProfile.gender) {
        whereClause.gender = myProfile.gender;
      } else {
        console.warn(`⚠️  Perfil ${myProfile.id} (gay) no tiene género definido`);
        whereClause.gender = null; // Esto no mostrará ningún perfil
      }
    }
    
    // Debug: Log para verificar la lógica
    console.log(`🔍 Buscando perfiles para usuario ${myProfile.id}:`, {
      orientation: myProfile.orientation,
      gender: myProfile.gender,
      city: myProfile.city,
      whereClause: JSON.stringify(whereClause),
    });

    // Filtro por ciudad (si no es Plus, solo puede ver su ciudad)
    // Normalizar comparación de ciudades (case-insensitive)
    if (!isPlus) {
      if (myProfile.city) {
        // Buscar perfiles con la misma ciudad (case-insensitive)
        const profilesInCity = await prisma.profile.findMany({
          where: {
            orientation: whereClause.orientation,
            gender: whereClause.gender,
          },
          select: { city: true },
          distinct: ['city'],
        });
        
        // Encontrar ciudades que coincidan (case-insensitive)
        const matchingCities = profilesInCity
          .map(p => p.city)
          .filter(c => c && c.toLowerCase() === myProfile.city?.toLowerCase());
        
        if (matchingCities.length > 0) {
          whereClause.city = { in: matchingCities };
        } else {
          whereClause.city = myProfile.city;
        }
      }
    } else if (city) {
      whereClause.city = city;
    }

    // Filtro ONLINE (solo 9Plus)
    if (filter === 'online') {
      if (!isPlus) {
        return res.status(403).json({
          error: 'Filtro ONLINE solo disponible para 9Plus',
          requiresPremium: true,
        });
      }
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      whereClause.OR = [
        { isOnline: true },
        { lastSeenAt: { gte: oneHourAgo } },
      ];
    }

    // Filtro TODO: conectados en el último mes
    if (filter === 'all' || !filter) {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      whereClause.lastSeenAt = { gte: oneMonthAgo };
    }

    // Filtro por edad (solo 9Plus)
    if (ageMin || ageMax) {
      if (!isPlus) {
        return res.status(403).json({
          error: 'Filtro de edad solo disponible para 9Plus',
          requiresPremium: true,
        });
      }
      whereClause.age = {
        ...(ageMin && { gte: parseInt(ageMin as string) }),
        ...(ageMax && { lte: parseInt(ageMax as string) }),
      };
    }

    // Obtener perfiles (solo los que tienen al menos una foto de portada)
    // PERMITIR perfiles falsos (los 7 perfiles de mujeres que creamos)
    let profiles = await prisma.profile.findMany({
      where: {
        ...whereClause,
        // Permitir perfiles falsos (los 7 perfiles de mujeres)
        photos: {
          some: {
            type: 'cover',
          },
        },
      },
      include: {
        photos: {
          where: { type: 'cover' },
          take: 1,
        },
        receivedLikes: {
          where: { fromProfileId: req.profileId! },
        },
      },
      orderBy: [
        { isRoaming: 'desc' }, // Perfiles en Roam primero
        { lastSeenAt: 'desc' },
      ],
      skip: (Number(page) - 1) * Number(limit),
      take: isPlus ? Number(limit) * 3 : Math.min(Number(limit) * 3, 150), // Obtener más para filtrar por distancia
    });
    
    // Filtrar perfiles que no tienen foto de portada (por si acaso)
    profiles = profiles.filter(profile => profile.photos && profile.photos.length > 0);

    // Ordenar perfiles: Roam activo primero, luego por fecha
    profiles.sort((a, b) => {
      const aRoaming = a.isRoaming && a.roamingUntil && new Date(a.roamingUntil) > new Date();
      const bRoaming = b.isRoaming && b.roamingUntil && new Date(b.roamingUntil) > new Date();
      
      if (aRoaming && !bRoaming) return -1;
      if (!aRoaming && bRoaming) return 1;
      return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    });
    
    // Eliminar duplicados por ID (asegurar que cada perfil aparece solo una vez)
    const uniqueProfiles = profiles.filter((profile, index, self) =>
      index === self.findIndex(p => p.id === profile.id)
    );
    profiles = uniqueProfiles;

    // Calcular distancia y filtrar por rango de distancia (solo 9Plus)
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

    // Filtrar por rango de distancia si es Plus y se especifica
    let filteredProfiles = profilesWithDistance;
    if (isPlus && (distanceMin || distanceMax)) {
      filteredProfiles = profilesWithDistance.filter(profile => {
        if (profile.distance === null) return false; // Solo mostrar si tiene coordenadas
        
        const min = distanceMin ? parseInt(distanceMin as string) : 1;
        const max = distanceMax ? parseInt(distanceMax as string) : 50;
        
        return profile.distance >= min && profile.distance <= max;
      });
    } else if (!isPlus) {
      // Free users no ven distancia, pero solo muestran perfiles de su ciudad
      filteredProfiles = profilesWithDistance.map(p => ({
        ...p,
        distance: null, // No mostrar distancia a usuarios free
      }));
    } else {
      // 9Plus sin filtro de distancia: mostrar distancia pero no filtrar
      filteredProfiles = profilesWithDistance;
    }

    // Eliminar duplicados finales (por si acaso)
    const finalUniqueProfiles = filteredProfiles.filter((profile, index, self) =>
      index === self.findIndex(p => p.id === profile.id)
    );

    // Limitar resultados finales
    const finalProfiles = finalUniqueProfiles.slice(0, isPlus ? Number(limit) : Math.min(Number(limit), 50));

    // Debug: Log de resultados
    console.log(`✅ Encontrados ${finalProfiles.length} perfiles para usuario ${myProfile.id} (${myProfile.orientation}, ${myProfile.gender})`);
    if (finalProfiles.length > 0) {
      console.log(`   Primeros perfiles encontrados:`, finalProfiles.slice(0, 3).map(p => ({ id: p.id, title: p.title, gender: p.gender, orientation: p.orientation, city: p.city })));
    }

    // Normalizar URLs de fotos antes de enviar
    const normalizedProfiles = normalizeProfilesPhotos(finalProfiles);

    res.json({
      profiles: normalizedProfiles,
      hasMore: finalUniqueProfiles.length > finalProfiles.length,
      isPlus,
    });
  } catch (error) {
    console.error('Error al buscar perfiles:', error);
    res.status(500).json({ error: 'Error al buscar perfiles' });
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

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        photos: {
          where: {
            OR: [{ type: 'cover' }, { type: 'public' }],
          },
        },
        receivedLikes: {
          where: { fromProfileId: req.profileId! },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // NO permitir ver perfiles falsos
    if (profile.isFake) {
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

    if (profile.orientation !== myProfile?.orientation) {
      return res.status(403).json({ error: 'No puedes ver este perfil' });
    }

    const isPlus = myProfile?.user?.subscription?.isActive || false;

    // Calcular distancia si es Plus
    const distance =
      isPlus &&
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

    // Normalizar URLs de fotos antes de enviar
    const normalizedProfile = normalizeProfilePhotos({
      ...profile,
      distance,
      isLiked: profile.receivedLikes.length > 0,
      receivedLikes: undefined,
    });

    res.json(normalizedProfile);
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
      where: { id: req.profileId },
      data: {
        city,
        latitude: latitude || null,
        longitude: longitude || null,
      },
    });

    res.json({ message: 'Ubicación actualizada' });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
};

