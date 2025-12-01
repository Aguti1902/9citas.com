import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const PHOTOS_DIR = path.join(__dirname, '../../fake-profiles-photos')

async function main() {
  console.log('🧹 Limpiando perfiles falsos...\n')

  // Obtener nombres de carpetas con fotos (estos son los que queremos mantener)
  const folders = fs.existsSync(PHOTOS_DIR)
    ? fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name.toLowerCase())
    : []

  console.log(`📁 Perfiles a mantener: ${folders.length}`)
  folders.forEach(folder => console.log(`  - ${folder}`))

  // Obtener todos los perfiles falsos
  const allFakeProfiles = await prisma.profile.findMany({
    where: {
      isFake: true,
    },
    include: {
      user: true,
    },
  })

  console.log(`\n📊 Total de perfiles falsos encontrados: ${allFakeProfiles.length}`)

  // Identificar perfiles a mantener (por email que coincide con las carpetas)
  const profilesToKeep: string[] = []
  
  for (const profile of allFakeProfiles) {
    if (profile.user) {
      const email = profile.user.email.toLowerCase()
      // El email es: folderName@fake.9citas.com
      const folderName = email.split('@')[0]
      if (folders.includes(folderName)) {
        profilesToKeep.push(profile.id)
        console.log(`✅ Mantener: ${profile.title} (${folderName})`)
      }
    }
  }

  console.log(`\n🗑️  Eliminando ${allFakeProfiles.length - profilesToKeep.length} perfiles falsos...`)

  // Eliminar perfiles que NO están en la lista de mantener
  const profilesToDelete = allFakeProfiles.filter(p => !profilesToKeep.includes(p.id))

  for (const profile of profilesToDelete) {
    // Eliminar fotos primero
    await prisma.photo.deleteMany({
      where: {
        profileId: profile.id,
      },
    })

    // Eliminar likes relacionados
    await prisma.like.deleteMany({
      where: {
        OR: [
          { fromProfileId: profile.id },
          { toProfileId: profile.id },
        ],
      },
    })

    // Eliminar mensajes relacionados
    await prisma.message.deleteMany({
      where: {
        OR: [
          { fromProfileId: profile.id },
          { toProfileId: profile.id },
        ],
      },
    })

    // Eliminar perfil
    await prisma.profile.delete({
      where: {
        id: profile.id,
      },
    })

    // Eliminar usuario si existe
    if (profile.userId) {
      await prisma.user.delete({
        where: {
          id: profile.userId,
        },
      }).catch(() => {
        // Ignorar si ya fue eliminado
      })
    }

    console.log(`  ❌ Eliminado: ${profile.title}`)
  }

  console.log(`\n✅ Limpieza completada!`)
  console.log(`📊 Perfiles mantenidos: ${profilesToKeep.length}`)
  console.log(`🗑️  Perfiles eliminados: ${profilesToDelete.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

