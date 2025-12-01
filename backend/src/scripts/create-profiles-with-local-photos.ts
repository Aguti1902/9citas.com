import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

const PHOTOS_DIR = path.join(__dirname, '../../fake-profiles-photos')

// Ciudades españolas
const SPANISH_CITIES = [
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Bilbao', lat: 43.263, lng: -2.935 },
]

// Personalidades para perfiles falsos
const PERSONALITIES = ['coqueta', 'seria', 'divertida', 'picante', 'romantica']

// Hobbies
const HOBBIES_LIST = ['Deportes', 'Gym', 'Viajar', 'Cine', 'Series', 'Música', 'Leer', 
  'Cocinar', 'Fotografía', 'Arte', 'Bailar', 'Playa', 'Montaña', 'Yoga']

// Obtener fotos de una carpeta
function getPhotosFromFolder(folderPath: string): string[] {
  const files = fs.readdirSync(folderPath)
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })
    .sort()
    .map(file => path.join(folderPath, file))
}

// Convertir ruta local a URL
function getPhotoUrl(localPath: string): string {
  // Obtener la URL del backend desde la variable de entorno o usar localhost
  const baseUrl = process.env.BACKEND_URL || process.env.RAILWAY_PUBLIC_DOMAIN || 'http://localhost:4000'
  const relativePath = path.relative(PHOTOS_DIR, localPath)
  // Asegurar que la ruta use barras normales
  const cleanPath = relativePath.replace(/\\/g, '/')
  return `${baseUrl}/fake-photos/${cleanPath}`
}

async function main() {
  console.log('🚀 Creando perfiles falsos con fotos locales...\n')

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`❌ La carpeta ${PHOTOS_DIR} no existe`)
    process.exit(1)
  }

  // Leer todas las carpetas y ordenarlas (chica1, chica2, etc.)
  let folders = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort() // Ordenar alfabéticamente para asegurar chica1, chica2, etc.

  if (folders.length === 0) {
    console.error('❌ No se encontraron carpetas con fotos')
    process.exit(1)
  }

  console.log(`📁 Encontradas ${folders.length} carpetas\n`)
  
  // LIMITAR A SOLO 7 PERFILES (las carpetas chica1 a chica7)
  if (folders.length > 7) {
    console.log(`⚠️  Se encontraron ${folders.length} carpetas, pero solo se crearán 7 perfiles`)
    folders = folders.slice(0, 7)
  }

  // Eliminar TODOS los perfiles falsos existentes (incluyendo los generados por seedHelpers)
  console.log('🗑️  Eliminando TODOS los perfiles falsos existentes...')
  
  // Primero eliminar todas las fotos de perfiles falsos
  const fakeProfiles = await prisma.profile.findMany({
    where: { isFake: true },
    select: { id: true },
  })
  
  if (fakeProfiles.length > 0) {
    const fakeProfileIds = fakeProfiles.map(p => p.id)
    await prisma.photo.deleteMany({
      where: {
        profileId: { in: fakeProfileIds },
      },
    })
    
    // Eliminar likes y otros datos relacionados
    await prisma.like.deleteMany({
      where: {
        OR: [
          { fromProfileId: { in: fakeProfileIds } },
          { toProfileId: { in: fakeProfileIds } },
        ],
      },
    })
    
    await prisma.message.deleteMany({
      where: {
        OR: [
          { fromProfileId: { in: fakeProfileIds } },
          { toProfileId: { in: fakeProfileIds } },
        ],
      },
    })
    
    // Eliminar usuarios asociados
    const fakeUsers = await prisma.user.findMany({
      where: {
        profile: {
          isFake: true,
        },
      },
      select: { id: true },
    })
    
    await prisma.profile.deleteMany({
      where: { isFake: true },
    })
    
    await prisma.user.deleteMany({
      where: {
        id: { in: fakeUsers.map(u => u.id) },
      },
    })
  }
  
  console.log('✅ Todos los perfiles falsos eliminados\n')

  // Nombres de mujeres españolas - ASIGNAR UNO POR PERFIL (sin repetir)
  const femaleNames = ['Sofía', 'María', 'Laura', 'Carmen', 'Ana', 'Elena', 'Marta']
  const usedNames: string[] = []

  // Crear perfiles para cada carpeta (SOLO 7)
  for (let i = 0; i < folders.length && i < 7; i++) {
    const folderName = folders[i]
    const folderPath = path.join(PHOTOS_DIR, folderName)
    const photos = getPhotosFromFolder(folderPath)

    if (photos.length === 0) {
      console.log(`⚠️  Carpeta ${folderName} no tiene fotos, saltando...`)
      continue
    }

    console.log(`👤 Creando perfil para ${folderName} (${photos.length} fotos)...`)

    // Datos aleatorios del perfil - SOLO MUJERES
    const city = faker.helpers.arrayElement(SPANISH_CITIES)
    const age = faker.number.int({ min: 22, max: 35 })
    const personality = faker.helpers.arrayElement(PERSONALITIES)
    
    // Asignar nombre único (sin repetir)
    let name: string
    do {
      name = faker.helpers.arrayElement(femaleNames)
    } while (usedNames.includes(name))
    usedNames.push(name)

    // Crear usuario fake
    const hashedPassword = crypto
      .createHash('sha256')
      .update(`fake-password-${folderName}`)
      .digest('hex')

    const user = await prisma.user.create({
      data: {
        email: `${folderName}@fake.9citas.com`,
        passwordHash: hashedPassword,
        emailVerified: true,
      },
    })

    // Crear perfil - SOLO MUJERES
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        title: name, // Nombre de mujer
        orientation: 'hetero',
        gender: 'mujer',
        aboutMe: `Soy ${name}, una chica de ${age} años ${personality === 'coqueta' ? 'coqueta' : personality === 'divertida' ? 'divertida' : personality === 'picante' ? 'atrevida' : personality === 'romantica' ? 'romántica' : 'seria'}. Me encanta conocer gente nueva y pasar buenos momentos.`,
        lookingFor: 'Busco conocer gente interesante y ver qué surge',
        age,
        city: city.name,
        latitude: city.lat + (Math.random() - 0.5) * 0.05,
        longitude: city.lng + (Math.random() - 0.5) * 0.05,
        height: faker.number.int({ min: 155, max: 175 }), // Altura típica de mujeres (155-175cm)
        bodyType: faker.helpers.arrayElement(['delgado', 'atlético', 'promedio']), // Tipos de cuerpo femeninos
        occupation: faker.helpers.arrayElement(['Marketing', 'Diseñadora', 'Enfermera', 'Profesora', 'Fotógrafa', 'Psicóloga', 'Veterinaria', 'Arquitecta']), // Solo profesiones femeninas
        hobbies: faker.helpers.arrayElements(HOBBIES_LIST, faker.number.int({ min: 3, max: 6 })),
        languages: ['Español', ...faker.helpers.arrayElements(['Inglés', 'Catalán'], faker.number.int({ min: 0, max: 2 }))],
        isOnline: Math.random() > 0.5,
        lastSeenAt: new Date(),
        isFake: true,
        personality,
      },
    })

    // Crear fotos
    // Primera foto = cover
    await prisma.photo.create({
      data: {
        profileId: profile.id,
        url: getPhotoUrl(photos[0]),
        type: 'cover',
      },
    })

    // Resto = públicas (máximo 3)
    const publicPhotos = photos.slice(1, 4)
    for (const photoPath of publicPhotos) {
      await prisma.photo.create({
        data: {
          profileId: profile.id,
          url: getPhotoUrl(photoPath),
          type: 'public',
        },
      })
    }

    console.log(`  ✅ Perfil creado: ${name} (${personality})`)
  }

  console.log(`\n✅ ${folders.length} perfiles falsos creados exitosamente`)
  console.log(`\n📝 NOTA: Las fotos están usando rutas locales.`)
  console.log(`   Para producción, sube las fotos a Cloudinary y actualiza las URLs.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

