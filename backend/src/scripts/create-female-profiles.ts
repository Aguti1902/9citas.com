import { PrismaClient } from '@prisma/client'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

// LISTA DE PERFILES FEMENINOS
// El usuario debe proporcionar las URLs de las imágenes
const femaleProfiles = [
  {
    name: 'Sofía',
    age: 24,
    city: 'Barcelona',
    coords: { lat: 41.3851, lng: 2.1734 },
    personality: 'coqueta',
    aboutMe: 'Amante de la playa y las noches de fiesta. Me encanta conocer gente nueva 😊',
    lookingFor: 'Alguien con quien compartir risas y buenos momentos',
    occupation: 'Marketing',
    hobbies: ['Playa', 'Música', 'Viajar'],
    photos: [
      'URL_IMAGEN_1', // El usuario debe reemplazar esto
    ],
  },
  {
    name: 'Laura',
    age: 28,
    city: 'Madrid',
    coords: { lat: 40.4168, lng: -3.7038 },
    personality: 'seria',
    aboutMe: 'Arquitecta apasionada por el diseño y el arte. Busco conexiones reales.',
    lookingFor: 'Una persona con la que tener conversaciones interesantes',
    occupation: 'Arquitectura',
    hobbies: ['Arte', 'Lectura', 'Café'],
    photos: [
      'URL_IMAGEN_2',
    ],
  },
  {
    name: 'Carmen',
    age: 26,
    city: 'Valencia',
    coords: { lat: 39.4699, lng: -0.3763 },
    personality: 'divertida',
    aboutMe: 'Siempre con una sonrisa. Me encanta bailar y disfrutar de la vida 🎉',
    lookingFor: 'Alguien que me haga reír tanto como yo a él',
    occupation: 'Enfermera',
    hobbies: ['Baile', 'Cocina', 'Deporte'],
    photos: [
      'URL_IMAGEN_3',
    ],
  },
  {
    name: 'Marta',
    age: 30,
    city: 'Sevilla',
    coords: { lat: 37.3891, lng: -5.9845 },
    personality: 'picante',
    aboutMe: 'La vida es muy corta para no disfrutarla al máximo 🔥',
    lookingFor: 'Alguien atrevido que sepa lo que quiere',
    occupation: 'Fotógrafa',
    hobbies: ['Fotografía', 'Vino', 'Viajes'],
    photos: [
      'URL_IMAGEN_4',
    ],
  },
  {
    name: 'Ana',
    age: 25,
    city: 'Bilbao',
    coords: { lat: 43.263, lng: -2.935 },
    personality: 'romantica',
    aboutMe: 'Soñadora empedernida. Creo en el amor verdadero 💕',
    lookingFor: 'Mi media naranja, alguien especial',
    occupation: 'Maestra',
    hobbies: ['Cine', 'Libros', 'Paseos'],
    photos: [
      'URL_IMAGEN_5',
    ],
  },
]

async function createFemaleProfiles() {
  console.log('🚀 Creando perfiles femeninos con IA...')

  for (const profileData of femaleProfiles) {
    try {
      // Crear usuario fake
      const hashedPassword = crypto
        .createHash('sha256')
        .update('fake-password-' + profileData.name)
        .digest('hex')

      const user = await prisma.user.create({
        data: {
          email: `${profileData.name.toLowerCase()}@fake.9citas.com`,
          passwordHash: hashedPassword,
          emailVerified: true,
        },
      })

      // Crear perfil
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          title: profileData.name,
          orientation: 'hetero',
          gender: 'mujer',
          aboutMe: profileData.aboutMe,
          lookingFor: profileData.lookingFor,
          age: profileData.age,
          city: profileData.city,
          latitude: profileData.coords.lat,
          longitude: profileData.coords.lng,
          occupation: profileData.occupation,
          hobbies: profileData.hobbies,
          height: Math.floor(Math.random() * 20) + 160, // 160-180cm
          bodyType: ['delgado', 'atlético', 'promedio'][Math.floor(Math.random() * 3)],
          isOnline: Math.random() > 0.5,
          lastSeenAt: new Date(),
          isFake: true,
          personality: profileData.personality,
        },
      })

      // Crear fotos
      for (const photoUrl of profileData.photos) {
        if (photoUrl.startsWith('URL_')) {
          console.log(`⚠️  ADVERTENCIA: ${profileData.name} - Reemplazar ${photoUrl} con URL real`)
          continue
        }
        
        await prisma.photo.create({
          data: {
            profileId: profile.id,
            url: photoUrl,
            type: 'cover',
          },
        })
      }

      console.log(`✅ Perfil creado: ${profileData.name} (${profileData.personality})`)
    } catch (error) {
      console.error(`❌ Error creando perfil ${profileData.name}:`, error)
    }
  }

  console.log('✅ Perfiles femeninos creados exitosamente')
}

createFemaleProfiles()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

