import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Nombres de mujeres españolas
const FEMALE_NAMES = [
  'Sofía', 'Lucía', 'María', 'Paula', 'Julia', 'Emma', 'Daniela', 'Martina',
  'Valeria', 'Olivia', 'Noa', 'Alma', 'Carmen', 'Elena', 'Adriana', 'Claudia'
];

// Personalidades para ChatGPT
const PERSONALITIES = ['coqueta', 'divertida', 'picante', 'romantica', 'seria'];

// Descripciones de mujeres
const ABOUT_ME_WOMEN = [
  'Me encanta la vida y disfrutar de cada momento',
  'Soy una persona alegre y positiva, me gusta reír y pasarlo bien',
  'Amante de la moda, la música y las buenas conversaciones',
  'Me gusta viajar, conocer nuevos lugares y personas interesantes',
  'Soy deportista, me encanta el fitness y llevar una vida saludable',
  'Fan del cine, las series y las tardes de sofá',
  'Me encanta la playa, el sol y los planes al aire libre',
  'Soy una persona sociable, me gusta salir y conocer gente nueva',
  'Amante de la gastronomía y los buenos restaurantes',
  'Me gusta la música en vivo, los conciertos y los festivales',
  'Soy creativa, me encanta el arte y la fotografía',
  'Persona tranquila que busca momentos especiales',
];

const LOOKING_FOR_WOMEN = [
  'Busco conocer gente interesante y ver qué surge',
  'Me gustaría encontrar a alguien especial con quien compartir momentos',
  'Busco conexión real y buena vibra',
  'Quiero conocer personas auténticas y sin complicaciones',
  'Busco alguien con quien reír y pasarlo bien',
  'Me gustaría encontrar a alguien que valore los pequeños detalles',
  'Busco momentos divertidos y buena compañía',
  'Quiero conocer personas con mis mismos intereses',
];

// Ocupaciones femeninas
const OCCUPATIONS = [
  'Diseñadora', 'Psicóloga', 'Profesora', 'Médica', 'Estudiante',
  'Marketing', 'Fotógrafa', 'Arquitecta', 'Enfermera', 'Abogada',
  'Chef', 'Artista', 'Periodista', 'Veterinaria', 'Ingeniera'
];

// Ciudades de España
const SPANISH_CITIES = [
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Bilbao', lat: 43.263, lng: -2.935 },
  { name: 'Alicante', lat: 38.3452, lng: -0.4815 },
];

interface ProfileData {
  name: string;
  age: number;
  city: { name: string; lat: number; lng: number };
  personality: string;
  aboutMe: string;
  lookingFor: string;
  height: number;
  photos: string[];
}

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

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateProfileData(folderName: string, index: number): ProfileData {
  const name = getRandomElement(FEMALE_NAMES);
  const age = Math.floor(Math.random() * 15) + 22; // 22-36 años
  const city = getRandomElement(SPANISH_CITIES);
  const personality = PERSONALITIES[index % PERSONALITIES.length];
  const aboutMe = getRandomElement(ABOUT_ME_WOMEN);
  const lookingFor = getRandomElement(LOOKING_FOR_WOMEN);
  const height = Math.floor(Math.random() * 20) + 158; // 158-177 cm (altura típica de mujer)

  return {
    name,
    age,
    city,
    personality,
    aboutMe,
    lookingFor,
    height,
    photos: [], // Se llenará después
  };
}

async function main() {
  console.log('👩 Creando perfiles de mujeres desde fotos locales...\n');

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

  console.log(`📁 Encontradas ${folders.length} carpetas de chicas\n`);

  // Eliminar perfiles falsos existentes
  console.log('🗑️  Eliminando perfiles falsos existentes...');
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
  console.log('✅ Perfiles falsos eliminados\n');

  // Crear perfiles
  for (let i = 0; i < folders.length; i++) {
    const folderName = folders[i];
    const folderPath = path.join(basePath, folderName);
    
    console.log(`📸 Procesando ${folderName}...`);
    
    // Cargar fotos de la carpeta
    const photos = await loadPhotosFromFolder(folderPath);
    
    if (photos.length === 0) {
      console.warn(`⚠️  No se encontraron fotos en ${folderName}, saltando...`);
      continue;
    }

    console.log(`   📷 ${photos.length} fotos encontradas`);

    // Generar datos del perfil
    const profileData = generateProfileData(folderName, i);
    profileData.photos = photos;

    // Variar coordenadas ligeramente dentro de la ciudad
    const latitude = profileData.city.lat + (Math.random() - 0.5) * 0.05;
    const longitude = profileData.city.lng + (Math.random() - 0.5) * 0.05;

    // Crear perfil
    const profile = await prisma.profile.create({
      data: {
        orientation: 'hetero', // Todas son hetero
        gender: 'mujer',
        title: profileData.name,
        aboutMe: profileData.aboutMe,
        lookingFor: profileData.lookingFor,
        age: profileData.age,
        city: profileData.city.name,
        latitude,
        longitude,
        height: profileData.height,
        bodyType: getRandomElement(['delgado', 'atletico', 'promedio']),
        relationshipStatus: getRandomElement(['soltero', 'complicado']),
        occupation: getRandomElement(OCCUPATIONS),
        education: getRandomElement(['universitario', 'posgrado', 'fp']),
        smoking: getRandomElement(['no', 'ocasional']),
        drinking: getRandomElement(['social', 'regular']),
        children: getRandomElement(['no', 'quiero']),
        pets: getRandomElement(['Ninguna', 'Perro', 'Gato']),
        zodiacSign: getRandomElement([
          'aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo',
          'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'
        ]),
        hobbies: getRandomElement([
          ['Cocinar', 'Fotografía', 'Bailar', 'Playa'],
          ['Moda', 'Gastronomía', 'Música', 'Arte'],
          ['Fitness', 'Yoga', 'Senderismo', 'Viajar'],
          ['Cine', 'Series', 'Lectura', 'Escritura'],
        ]),
        languages: ['Español', getRandomElement(['Inglés', 'Francés', 'Italiano'])],
        isOnline: Math.random() < 0.2, // 20% online
        lastSeenAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Últimos 3 días
        isFake: true,
        personality: profileData.personality, // Guardar personalidad para ChatGPT
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
    console.log(`   📏 Altura: ${profileData.height} cm\n`);
  }

  console.log(`\n✅ ${folders.length} perfiles de mujeres creados exitosamente`);
  console.log('\n📝 Notas:');
  console.log('   - Todas las mujeres son hetero y solo verán hombres hetero');
  console.log('   - Los perfiles darán like automático después de 1-2 minutos');
  console.log('   - Están conectados con ChatGPT para responder mensajes');
  console.log('   - Las fotos se sirven desde /fake-photos/');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

