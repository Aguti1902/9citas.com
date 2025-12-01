import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Interfaz para las fotos subidas
interface PhotoSet {
  folderName: string;
  photos: {
    cover: string;
    public: string[];
  };
}

// Cargar fotos reales si existen
function loadRealPhotos(): PhotoSet[] | null {
  const photosFile = path.join(__dirname, '../../fake-profiles-photos-urls.json');
  
  if (!fs.existsSync(photosFile)) {
    console.log('ℹ️  No se encontró archivo de fotos reales. Usando fotos de Picsum.');
    return null;
  }

  try {
    const content = fs.readFileSync(photosFile, 'utf-8');
    const photoSets: PhotoSet[] = JSON.parse(content);
    console.log(`✅ Cargadas ${photoSets.length} sets de fotos reales`);
    return photoSets;
  } catch (error) {
    console.error('❌ Error leyendo archivo de fotos:', error);
    return null;
  }
}

// Ciudades de España con coordenadas aproximadas
const SPANISH_CITIES = [
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Bilbao', lat: 43.263, lng: -2.935 },
  { name: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
  { name: 'Alicante', lat: 38.3452, lng: -0.4815 },
  { name: 'Murcia', lat: 37.9922, lng: -1.1307 },
  { name: 'Las Palmas', lat: 28.1248, lng: -15.4300 },
  { name: 'Palma de Mallorca', lat: 39.5696, lng: 2.6502 },
  { name: 'Granada', lat: 37.1773, lng: -3.5986 },
  { name: 'Córdoba', lat: 37.8882, lng: -4.7794 },
  { name: 'Valladolid', lat: 41.6523, lng: -4.7245 },
  { name: 'San Sebastián', lat: 43.3183, lng: -1.9812 },
  { name: 'Santander', lat: 43.4623, lng: -3.8099 },
  { name: 'Toledo', lat: 39.8628, lng: -4.0273 },
  { name: 'Salamanca', lat: 40.9701, lng: -5.6635 },
  { name: 'Pamplona', lat: 42.8125, lng: -1.6458 },
  { name: 'Girona', lat: 41.9793, lng: 2.8214 },
];

// Frases para descripciones
const ABOUT_ME_PHRASES = [
  'Me encanta viajar y conocer nuevos lugares',
  'Apasionado del deporte y la vida sana',
  'Amante de la música y las buenas conversaciones',
  'Busco conocer gente interesante',
  'Disfrutando de la vida y lo que ofrece',
  'Aventurero y siempre listo para nuevas experiencias',
  'Fan del cine y las series',
  'Me gusta la playa y el sol',
  'Persona tranquila que busca buenos momentos',
  'Deportista y con ganas de conocer gente',
  'Amante de la naturaleza y las escapadas',
  'Sociable y con buen sentido del humor',
  'Sencillo y con ganas de pasarlo bien',
];

const LOOKING_FOR_PHRASES = [
  'Busco conocer gente nueva y ver qué surge',
  'Me gustaría encontrar alguien especial',
  'Busco amistad y quién sabe si algo más',
  'Quiero conocer personas interesantes',
  'Busco momentos divertidos y buena compañía',
  'Me gustaría encontrar conexión real',
  'Busco gente auténtica y sin rollos',
  'Quiero conocer personas con mis intereses',
  'Busco algo casual y divertido',
  'Me gustaría encontrar a alguien con quien compartir',
];

// Generar nombre aleatorio español
const generateSpanishName = (): string => {
  const maleNames = ['Carlos', 'David', 'Jorge', 'Alejandro', 'Miguel', 'Javier', 'Pablo', 'Sergio', 'Daniel', 'Alberto', 'Raúl', 'Manuel', 'Antonio', 'Juan', 'Francisco', 'Adrián', 'Iván', 'Rubén', 'Diego', 'Marcos'];
  const femaleNames = ['María', 'Carmen', 'Ana', 'Laura', 'Marta', 'Sara', 'Elena', 'Paula', 'Lucía', 'Cristina', 'Beatriz', 'Raquel', 'Natalia', 'Andrea', 'Julia', 'Sofía', 'Alba', 'Irene', 'Carla', 'Nuria'];
  const names = [...maleNames, ...femaleNames];
  
  return faker.helpers.arrayElement(names);
};

// Hobbies disponibles
const HOBBIES_LIST = ['Deportes', 'Gym', 'Viajar', 'Cine', 'Series', 'Música', 'Leer', 
  'Cocinar', 'Videojuegos', 'Fotografía', 'Arte', 'Bailar', 'Senderismo', 'Playa', 
  'Montaña', 'Yoga', 'Mascotas', 'Tecnología', 'Moda', 'Gastronomía'];

const LANGUAGES_LIST = ['Español', 'Inglés', 'Catalán', 'Francés', 'Alemán', 'Italiano'];

// Generar perfiles falsos
export const generateFakeProfiles = async (count: number = 300) => {
  console.log(`Generando ${count} perfiles falsos...`);

  // Cargar fotos reales si existen
  const realPhotos = loadRealPhotos();
  let photoSetIndex = 0;

  const profiles: any[] = [];

  for (let i = 0; i < count; i++) {
    const orientation = i < count / 2 ? 'hetero' : 'gay';
    const city = faker.helpers.arrayElement(SPANISH_CITIES);
    const age = faker.number.int({ min: 18, max: 60 });
    const name = generateSpanishName();
    
    // Asignar género según orientación
    // Heteros: 50% hombres, 50% mujeres
    // Gays: 50% hombres, 50% mujeres (pero solo verán del mismo género)
    const gender = faker.helpers.arrayElement(['hombre', 'mujer']);
    
    // Variar coordenadas ligeramente para simular diferentes ubicaciones en la ciudad
    // Reducir la variación para que estén más cerca (máximo 0.05 grados ≈ 5.5 km)
    const latitude = city.lat + (Math.random() - 0.5) * 0.05;
    const longitude = city.lng + (Math.random() - 0.5) * 0.05;

    // Estado online: 10-15% online, resto con lastSeenAt reciente
    const isOnline = Math.random() < 0.15;
    const lastSeenAt = isOnline 
      ? new Date()
      : faker.date.recent({ days: 3 });

    // Seleccionar 3-6 hobbies aleatorios
    const selectedHobbies = faker.helpers.arrayElements(HOBBIES_LIST, faker.number.int({ min: 3, max: 6 }));
    
    // Seleccionar 1-3 idiomas (siempre incluye Español)
    const selectedLanguages = ['Español', ...faker.helpers.arrayElements(
      LANGUAGES_LIST.filter(l => l !== 'Español'), 
      faker.number.int({ min: 0, max: 2 })
    )];

    const profile = {
      orientation,
      gender, // Añadir género
      title: name,
      aboutMe: faker.helpers.arrayElement(ABOUT_ME_PHRASES),
      lookingFor: faker.helpers.arrayElement(LOOKING_FOR_PHRASES),
      age,
      city: city.name,
      latitude,
      longitude,
      height: faker.number.int({ min: 155, max: 195 }),
      bodyType: faker.helpers.arrayElement(['delgado', 'atletico', 'promedio', 'musculoso', 'corpulento']),
      relationshipStatus: faker.helpers.arrayElement(['soltero', 'divorciado', 'complicado']),
      occupation: faker.helpers.arrayElement([
        'Ingeniero', 'Diseñador', 'Profesor', 'Médico', 'Estudiante', 
        'Empresario', 'Fotógrafo', 'Marketing', 'Ventas', 'Arquitecto',
        'Programador', 'Enfermero', 'Abogado', 'Chef', 'Artista'
      ]),
      education: faker.helpers.arrayElement(['secundaria', 'bachillerato', 'fp', 'universitario', 'posgrado']),
      smoking: faker.helpers.arrayElement(['no', 'ocasional', 'regular']),
      drinking: faker.helpers.arrayElement(['no', 'social', 'regular']),
      children: faker.helpers.arrayElement(['no', 'si_vivo', 'si_no_vivo', 'quiero']),
      pets: faker.helpers.arrayElement(['Ninguna', 'Perro', 'Gato', 'Perro y Gato', 'Otras']),
      zodiacSign: faker.helpers.arrayElement([
        'aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo', 
        'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'
      ]),
      hobbies: selectedHobbies,
      languages: selectedLanguages,
      isOnline,
      lastSeenAt,
      isFake: true,
      createdAt: faker.date.recent({ days: 30 }),
    };

    profiles.push(profile);
  }

  // Crear perfiles en lotes
  const batchSize = 50;
  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (profileData) => {
        const profile = await prisma.profile.create({
          data: profileData,
        });

        // Crear fotos para cada perfil
        const photos: any[] = [];

        // Usar fotos reales si están disponibles, sino usar Picsum
        if (realPhotos && photoSetIndex < realPhotos.length) {
          const photoSet = realPhotos[photoSetIndex];
          
          // Foto de portada
          photos.push({
            profileId: profile.id,
            url: photoSet.photos.cover,
            type: 'cover',
          });

          // Fotos públicas (máximo 3)
          const publicPhotos = photoSet.photos.public.slice(0, 3);
          publicPhotos.forEach((url) => {
            photos.push({
              profileId: profile.id,
              url: url,
              type: 'public',
            });
          });

          photoSetIndex++;
        } else {
          // Fallback: usar fotos de Picsum
          const photoCount = faker.number.int({ min: 2, max: 4 });
          
          // Foto de portada
          photos.push({
            profileId: profile.id,
            url: `https://picsum.photos/400/600?random=${profile.id}-cover`,
            type: 'cover',
          });

          // Fotos adicionales públicas
          for (let j = 1; j < photoCount; j++) {
            photos.push({
              profileId: profile.id,
              url: `https://picsum.photos/400/600?random=${profile.id}-${j}`,
              type: 'public',
            });
          }
        }

        await prisma.photo.createMany({
          data: photos,
        });
      })
    );

    console.log(`Progreso: ${Math.min(i + batchSize, profiles.length)}/${profiles.length}`);
  }

  console.log(`✅ ${count} perfiles falsos creados exitosamente`);
};

