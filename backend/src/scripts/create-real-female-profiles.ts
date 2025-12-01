import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Datos de las 7 chicas con nombres, edades, ciudades y personalidades
const PROFILES_DATA = [
  {
    name: 'Sofía',
    age: 24,
    city: { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
    personality: 'coqueta',
    aboutMe: 'Me encanta la vida y disfrutar de cada momento. Soy una persona alegre y positiva, me gusta reír y pasarlo bien. Amante de la moda y las buenas conversaciones.',
    lookingFor: 'Busco conocer gente interesante y ver qué surge. Me gustaría encontrar a alguien especial con quien compartir momentos.',
    height: 168,
    occupation: 'Diseñadora',
    hobbies: ['Moda', 'Fotografía', 'Bailar', 'Playa'],
  },
  {
    name: 'Lucía',
    age: 26,
    city: { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
    personality: 'divertida',
    aboutMe: 'Soy una persona alegre y divertida, me encanta bromear y usar emojis. Eres espontánea y simpática. Fan del cine, las series y las tardes de sofá.',
    lookingFor: 'Busco momentos divertidos y buena compañía. Quiero conocer personas con mis mismos intereses.',
    height: 165,
    occupation: 'Psicóloga',
    hobbies: ['Cine', 'Series', 'Lectura', 'Escritura'],
  },
  {
    name: 'María',
    age: 28,
    city: { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
    personality: 'picante',
    aboutMe: 'Soy una mujer atrevida y sensual. Me gusta el juego de seducción y las conversaciones directas. Amante de la gastronomía y los buenos restaurantes.',
    lookingFor: 'Busco conexión real y buena vibra. Quiero conocer personas auténticas y sin complicaciones.',
    height: 170,
    occupation: 'Chef',
    hobbies: ['Gastronomía', 'Cocinar', 'Música', 'Arte'],
  },
  {
    name: 'Paula',
    age: 23,
    city: { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
    personality: 'romantica',
    aboutMe: 'Soy una mujer romántica y soñadora. Me gustan los detalles y las conversaciones emotivas. Amante de la música en vivo, los conciertos y los festivales.',
    lookingFor: 'Me gustaría encontrar a alguien especial que valore los pequeños detalles. Busco conexión real.',
    height: 162,
    occupation: 'Artista',
    hobbies: ['Música', 'Arte', 'Fotografía', 'Viajar'],
  },
  {
    name: 'Elena',
    age: 27,
    city: { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
    personality: 'seria',
    aboutMe: 'Soy una mujer seria y madura. Valoro las conversaciones profundas y las relaciones auténticas. Me encanta viajar y conocer nuevos lugares.',
    lookingFor: 'Busco alguien con quien compartir momentos especiales. Valoro la autenticidad y la sinceridad.',
    height: 164,
    occupation: 'Periodista',
    hobbies: ['Lectura', 'Viajar', 'Fotografía', 'Senderismo'],
  },
  {
    name: 'Carla',
    age: 25,
    city: { name: 'Bilbao', lat: 43.263, lng: -2.935 },
    personality: 'coqueta',
    aboutMe: 'Me encanta la playa, el sol y los planes al aire libre. Soy sociable, me gusta salir y conocer gente nueva. Deportista y con ganas de vivir.',
    lookingFor: 'Busco conocer gente nueva y ver qué surge. Me gustaría encontrar momentos divertidos y buena compañía.',
    height: 166,
    occupation: 'Marketing',
    hobbies: ['Fitness', 'Playa', 'Deportes', 'Yoga'],
  },
  {
    name: 'Natalia',
    age: 29,
    city: { name: 'Alicante', lat: 38.3452, lng: -0.4815 },
    personality: 'divertida',
    aboutMe: 'Soy creativa, me encanta el arte y la fotografía. Persona tranquila que busca momentos especiales. Fan de la naturaleza y las escapadas.',
    lookingFor: 'Quiero conocer personas interesantes. Busco alguien con quien reír y pasarlo bien.',
    height: 163,
    occupation: 'Fotógrafa',
    hobbies: ['Fotografía', 'Arte', 'Naturaleza', 'Senderismo'],
  },
];

async function loadPhotosFromFolder(folderPath: string): Promise<string[]> {
  const photos: string[] = [];
  
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️  Carpeta no encontrada: ${folderPath}`);
    return photos;
  }

  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      // URL relativa para servir desde /fake-photos
      const relativePath = path.relative(
        path.join(__dirname, '../../fake-profiles-photos'),
        path.join(folderPath, file)
      );
      photos.push(`/fake-photos/${relativePath.replace(/\\/g, '/')}`);
    }
  });

  // Ordenar fotos por nombre
  photos.sort();
  
  return photos;
}

async function main() {
  console.log('👩 Creando 7 perfiles REALES de mujeres desde fotos locales...\n');

  const basePath = path.join(__dirname, '../../fake-profiles-photos');
  
  if (!fs.existsSync(basePath)) {
    console.error('❌ Carpeta fake-profiles-photos no encontrada');
    process.exit(1);
  }

  // Obtener todas las carpetas de chicas
  const folders = fs.readdirSync(basePath)
    .filter(item => {
      const itemPath = path.join(basePath, item);
      return fs.statSync(itemPath).isDirectory() && item.startsWith('chica');
    })
    .sort(); // Ordenar: chica1, chica2, etc.

  if (folders.length === 0) {
    console.error('❌ No se encontraron carpetas de chicas (chica1, chica2, etc.)');
    process.exit(1);
  }

  if (folders.length !== 7) {
    console.warn(`⚠️  Se encontraron ${folders.length} carpetas, pero se esperaban 7`);
  }

  console.log(`📁 Encontradas ${folders.length} carpetas de chicas\n`);

  // Eliminar TODOS los perfiles fake existentes
  console.log('🗑️  Eliminando todos los perfiles fake existentes...');
  await prisma.photo.deleteMany({
    where: {
      profile: {
        isFake: true,
      },
    },
  });
  await prisma.like.deleteMany({
    where: {
      OR: [
        { fromProfile: { isFake: true } },
        { toProfile: { isFake: true } },
      ],
    },
  });
  await prisma.message.deleteMany({
    where: {
      OR: [
        { fromProfile: { isFake: true } },
        { toProfile: { isFake: true } },
      ],
    },
  });
  await prisma.profile.deleteMany({
    where: { isFake: true },
  });
  console.log('✅ Perfiles fake eliminados\n');

  // Crear perfiles REALES
  for (let i = 0; i < Math.min(folders.length, PROFILES_DATA.length); i++) {
    const folderName = folders[i];
    const folderPath = path.join(basePath, folderName);
    const profileData = PROFILES_DATA[i];
    
    console.log(`📸 Procesando ${folderName} - ${profileData.name}...`);
    
    // Cargar fotos de la carpeta
    const photos = await loadPhotosFromFolder(folderPath);
    
    if (photos.length === 0) {
      console.warn(`⚠️  No se encontraron fotos en ${folderName}, saltando...`);
      continue;
    }

    console.log(`   📷 ${photos.length} fotos encontradas`);

    // Variar coordenadas ligeramente dentro de la ciudad
    const latitude = profileData.city.lat + (Math.random() - 0.5) * 0.05;
    const longitude = profileData.city.lng + (Math.random() - 0.5) * 0.05;

    // Crear usuario (con email único y contraseña hasheada)
    const email = `${profileData.name.toLowerCase()}${i + 1}@9citas.com`;
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: true, // Verificado automáticamente
      },
    });

    // Crear perfil REAL (NO fake)
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        orientation: 'hetero',
        gender: 'mujer',
        title: profileData.name,
        aboutMe: profileData.aboutMe,
        lookingFor: profileData.lookingFor,
        age: profileData.age,
        city: profileData.city.name,
        latitude,
        longitude,
        height: profileData.height,
        bodyType: ['delgado', 'atletico', 'promedio'][i % 3],
        relationshipStatus: ['soltero', 'complicado'][i % 2],
        occupation: profileData.occupation,
        education: ['universitario', 'posgrado'][i % 2],
        smoking: ['no', 'ocasional'][i % 2],
        drinking: ['social', 'regular'][i % 2],
        children: ['no', 'quiero'][i % 2],
        pets: ['Ninguna', 'Perro', 'Gato'][i % 3],
        zodiacSign: [
          'aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo',
          'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'
        ][i % 12],
        hobbies: profileData.hobbies,
        languages: ['Español', i % 2 === 0 ? 'Inglés' : 'Francés'],
        isOnline: Math.random() < 0.2, // 20% online
        lastSeenAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Últimos 3 días
        isFake: false, // PERFIL REAL
        personality: profileData.personality, // Para ChatGPT
      },
    });

    // Crear fotos
    const photoRecords = [];
    
    // Primera foto como cover
    if (photos.length > 0) {
      photoRecords.push({
        profileId: profile.id,
        url: photos[0],
        type: 'cover' as const,
      });
    }

    // Resto como públicas (máximo 3 públicas según el esquema)
    const publicPhotos = photos.slice(1, 4); // Máximo 3 públicas
    publicPhotos.forEach(photoUrl => {
      photoRecords.push({
        profileId: profile.id,
        url: photoUrl,
        type: 'public' as const,
      });
    });

    // Si hay más fotos, guardarlas como privadas (máximo 4 privadas)
    const privatePhotos = photos.slice(4, 8); // Máximo 4 privadas
    privatePhotos.forEach(photoUrl => {
      photoRecords.push({
        profileId: profile.id,
        url: photoUrl,
        type: 'private' as const,
      });
    });

    await prisma.photo.createMany({
      data: photoRecords,
    });

    console.log(`✅ ${profileData.name} (${profileData.age} años) creada en ${profileData.city.name}`);
    console.log(`   📸 ${photoRecords.length} fotos añadidas (${photoRecords.filter(p => p.type === 'cover').length} cover, ${photoRecords.filter(p => p.type === 'public').length} públicas, ${photoRecords.filter(p => p.type === 'private').length} privadas)`);
    console.log(`   🎭 Personalidad: ${profileData.personality}`);
    console.log(`   📏 Altura: ${profileData.height} cm`);
    console.log(`   📧 Email: ${email}`);
    console.log('');
  }

  console.log(`\n✅ ${Math.min(folders.length, PROFILES_DATA.length)} perfiles REALES de mujeres creados exitosamente`);
  console.log('\n📝 Notas:');
  console.log('   - Todos los perfiles son REALES (isFake: false)');
  console.log('   - Todas las mujeres son hetero y solo verán hombres hetero');
  console.log('   - Los perfiles darán like automático después de 1-2 minutos');
  console.log('   - Están conectados con ChatGPT para responder mensajes');
  console.log('   - Las fotos se sirven desde /fake-photos/');
  console.log('   - Emails creados: nombre1@9citas.com, nombre2@9citas.com, etc.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

