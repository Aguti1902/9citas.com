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

  const { title, aboutMe, lookingFor, age, gender, city, latitude, longitude,
          height, bodyType, relationshipStatus, occupation, education, smoking, drinking,
          children, pets, zodiacSign, hobbies, languages } = req.body;

  const updatedProfile = await prisma.profile.update({
    where: { id: req.profileId },
    data: {
      ...(title && { title }),
      ...(aboutMe && { aboutMe }),
      ...(lookingFor && { lookingFor }),
      ...(age && { age }),
      ...(gender && { gender }),
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

    // IMPORTANTE: Solo excluir perfiles a los que TÚ les diste like
    // Si alguien te da like a ti, DEBES poder verlo en navegación (si tú no le has dado like aún)
    // Si le das like después → match
    // Si le das dislike/pass → simplemente pasas y su like queda ahí
    const sentLikes = await prisma.like.findMany({
      where: { fromProfileId: req.profileId! },
      select: { toProfileId: true },
    });
    const likedProfileIds = sentLikes.map(like => like.toProfileId);

    // Construir filtros base
    // IMPORTANTE: Mostrar TODOS los perfiles reales (no fake)
    const whereClause: any = {
      id: { notIn: [req.profileId!, ...blockedIds, ...likedProfileIds] }, // Solo excluir perfiles a los que TÚ les diste like
      orientation: myProfile.orientation, // Mismo orientation (hetero ve hetero, gay ve gay)
      // Mostrar perfiles reales (no fake)
      OR: [
        { isFake: false },
        { isFake: null },
      ],
    };

    // Lógica de matching según orientación y género
    // Heteros: solo ven del género opuesto que sean heteros
    // Gays: solo ven del mismo género que sean gays
    if (myProfile.orientation === 'hetero') {
      // Heteros solo ven del género opuesto
      if (myProfile.gender === 'hombre') {
        whereClause.gender = 'mujer'; // Hombres heteros ven mujeres hetero
      } else if (myProfile.gender === 'mujer') {
        whereClause.gender = 'hombre'; // Mujeres heteras ven hombres hetero
      } else {
        // Si no tiene género definido, no mostrar nada
        console.error(`❌ ERROR: Perfil ${myProfile.id} no tiene género definido. Orientation: ${myProfile.orientation}`);
        whereClause.gender = null; // Esto no mostrará ningún perfil
      }
    } else if (myProfile.orientation === 'gay') {
      // Gays solo ven del mismo género
      if (myProfile.gender) {
        whereClause.gender = myProfile.gender;
      } else {
        console.error(`❌ ERROR: Perfil ${myProfile.id} (gay) no tiene género definido`);
        whereClause.gender = null; // Esto no mostrará ningún perfil
      }
    }
    
    // Debug: Log para verificar la lógica
    console.log(`\n🔍 ===== BÚSQUEDA DE PERFILES =====`);
    console.log(`👤 Usuario: ${myProfile.title} (${myProfile.id})`);
    console.log(`   - Orientación: ${myProfile.orientation}`);
    console.log(`   - Género: ${myProfile.gender || 'NO DEFINIDO ❌'}`);
    console.log(`   - Ciudad: ${myProfile.city || 'No definida'}`);
    console.log(`   - Tipo: ${isPlus ? '9Plus' : 'Gratuito'}`);
    console.log(`   - Excluidos (likes): ${likedProfileIds.length}`);
    console.log(`   - Bloqueados: ${blockedIds.length}`);
    console.log(`\n📋 Filtros aplicados:`);
    console.log(`   - Género buscado: ${whereClause.gender || 'NO DEFINIDO ❌'}`);
    console.log(`   - Orientación: ${whereClause.orientation}`);
    console.log(`   - isFake: ${JSON.stringify(whereClause.OR)}`);
    console.log(`   - Excluir IDs: ${[req.profileId!, ...blockedIds, ...likedProfileIds].length} perfiles`);

    // IMPORTANTE: Usuarios gratuitos (no 9Plus) ven TODOS los perfiles que coinciden
    // NO tienen restricción de ciudad, distancia ni edad
    // Solo pueden ver hasta 50 perfiles al día
    
    // Usuarios 9Plus: pueden filtrar por ciudad, distancia, edad, etc.
    if (isPlus && city) {
      // Usuario Plus: puede filtrar por ciudad específica si lo desea
      whereClause.city = city;
      console.log(`✅ Usuario 9Plus filtrando por ciudad: ${city}`);
    } else if (!isPlus) {
      // Usuario gratuito: NO filtrar por ciudad, ver TODOS los perfiles que coinciden
      console.log(`✅ Usuario gratuito: mostrando TODOS los perfiles que coinciden (sin filtro de ciudad)`);
      // Asegurarse de que NO haya filtro de ciudad
      if (whereClause.city) {
        delete whereClause.city;
      }
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

    // Filtro TODO: mostrar todos los perfiles activos (no filtrar por lastSeenAt)
    // Esto permite que nuevos usuarios vean perfiles aunque no se hayan conectado recientemente
    if (filter === 'all' || !filter) {
      // No aplicar filtro de lastSeenAt para que aparezcan todos los perfiles
      // Si quieres filtrar por actividad, puedes usar el filtro "online" o "new"
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

    // IMPORTANTE: Verificar que el género esté definido antes de buscar
    if (!whereClause.gender) {
      console.error(`❌ ERROR CRÍTICO: No se puede buscar perfiles sin género definido`);
      return res.status(400).json({ 
        error: 'Tu perfil no tiene género definido. Por favor, actualiza tu perfil.',
        details: {
          myGender: myProfile.gender,
          myOrientation: myProfile.orientation,
        }
      });
    }

    // Obtener perfiles (solo los que tienen al menos una foto de portada)
    // IMPORTANTE: Buscar TODOS los perfiles que coinciden con los criterios
    console.log(`\n🔎 Ejecutando búsqueda en base de datos...`);
    console.log(`   Query:`, {
      gender: whereClause.gender,
      orientation: whereClause.orientation,
      isFake: whereClause.OR,
      excludedIds: whereClause.id?.notIn?.length || 0,
    });
    
    let profiles = await prisma.profile.findMany({
      where: {
        ...whereClause,
        // REQUISITO: Debe tener al menos una foto de portada
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
    
    console.log(`   ✅ Encontrados ${profiles.length} perfiles en la consulta inicial`);
    
    // Filtrar perfiles que no tienen foto de portada (por si acaso)
    profiles = profiles.filter(profile => profile.photos && profile.photos.length > 0);
    
    console.log(`\n📊 Resultados de búsqueda:`);
    console.log(`   - Perfiles encontrados: ${profiles.length}`);
    if (profiles.length > 0) {
      console.log(`   - Primeros perfiles:`, profiles.slice(0, 5).map(p => ({
        nombre: p.title,
        género: p.gender,
        orientación: p.orientation,
        ciudad: p.city,
        fotos: p.photos.length
      })));
    } else {
      console.error(`   ❌ NO SE ENCONTRARON PERFILES`);
      console.error(`   Verificar:`);
      console.error(`   1. ¿Hay perfiles con género "${whereClause.gender}" y orientación "${whereClause.orientation}"?`);
      console.error(`   2. ¿Tienen foto de portada?`);
      console.error(`   3. ¿Están marcados como isFake: false o null?`);
    }

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
    if (isPlus && (distanceMin !== undefined || distanceMax !== undefined)) {
      filteredProfiles = profilesWithDistance.filter(profile => {
        if (profile.distance === null) return false; // Solo mostrar si tiene coordenadas
        
        const min = distanceMin !== undefined ? parseInt(distanceMin as string) : 0;
        const max = distanceMax !== undefined ? parseInt(distanceMax as string) : 500;
        
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
    // Usuarios gratuitos: máximo 50 perfiles al día
    // Usuarios 9Plus: sin límite (o el límite que especifiquen)
    const maxProfilesForFree = 50;
    const finalProfiles = finalUniqueProfiles.slice(0, isPlus ? Number(limit) : Math.min(Number(limit), maxProfilesForFree));

    // Debug: Log de resultados FINALES
    console.log(`\n✅ ===== RESULTADOS FINALES =====`);
    console.log(`📊 Perfiles encontrados: ${finalProfiles.length}`);
    console.log(`👤 Usuario: ${myProfile.title} (${myProfile.id})`);
    console.log(`   - Tipo: ${isPlus ? '9Plus' : 'Gratuito (máx 50/día)'}`);
    console.log(`   - Orientación: ${myProfile.orientation}`);
    console.log(`   - Género: ${myProfile.gender}`);
    console.log(`   - Ciudad: ${myProfile.city || 'No definida'}`);
    console.log(`   - Buscando: ${whereClause.gender} ${whereClause.orientation}`);
    console.log(`   - Excluidos (likes): ${likedProfileIds.length}`);
    console.log(`   - Bloqueados: ${blockedIds.length}`);
    
    if (finalProfiles.length > 0) {
      console.log(`\n✅ PERFILES ENCONTRADOS:`);
      finalProfiles.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.title} - ${p.gender} ${p.orientation} - ${p.city}`);
      });
    } else {
      console.error(`\n❌ NO SE ENCONTRARON PERFILES`);
      console.error(`\n🔍 DIAGNÓSTICO:`);
      console.error(`   1. ¿Hay perfiles con género "${whereClause.gender}" y orientación "${whereClause.orientation}"?`);
      console.error(`   2. ¿Tienen foto de portada?`);
      console.error(`   3. ¿Están marcados como isFake: false o null?`);
      console.error(`   4. ¿Están bloqueados o ya les diste like?`);
      console.error(`   5. ¿Tu perfil tiene género y orientación definidos?`);
    }
    console.log(`\n${'='.repeat(60)}\n`);

    // Normalizar URLs de fotos antes de enviar
    const normalizedProfiles = normalizeProfilesPhotos(finalProfiles);

    res.json({
      profiles: normalizedProfiles,
      hasMore: finalUniqueProfiles.length > finalProfiles.length,
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

    // Siempre incluir todas las fotos (públicas y privadas) para que el frontend pueda mostrarlas borrosas
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        photos: true, // Incluir todas las fotos
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

