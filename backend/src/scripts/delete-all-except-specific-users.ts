import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const prisma = new PrismaClient()

// Mostrar qué base de datos se está usando
const dbUrl = process.env.DATABASE_URL || 'No configurada'
const dbName = dbUrl.includes('railway') ? 'PRODUCCIÓN (Railway)' : dbUrl.includes('localhost') ? 'LOCAL' : 'DESCONOCIDA'
console.log(`🔗 Conectando a: ${dbName}\n`)

// Emails que NO se deben eliminar
const KEEP_EMAILS = ['agutierrez3b1415@gmail.com', 'hola@gmail.com']

async function main() {
  console.log('🗑️  Eliminando todas las cuentas excepto las especificadas...\n')
  console.log(`📌 Manteniendo: ${KEEP_EMAILS.join(', ')}\n`)

  // Obtener todos los usuarios
  const allUsers = await prisma.user.findMany({
    include: {
      profile: true,
    },
  })

  console.log(`📊 Total de usuarios encontrados: ${allUsers.length}`)

  // Filtrar usuarios a eliminar (todos excepto los especificados)
  // Comparación case-insensitive
  const keepEmailsLower = KEEP_EMAILS.map(e => e.toLowerCase())
  const usersToDelete = allUsers.filter(
    user => !keepEmailsLower.includes(user.email.toLowerCase())
  )

  console.log(`🗑️  Usuarios a eliminar: ${usersToDelete.length}`)
  console.log(`✅ Usuarios a mantener: ${allUsers.length - usersToDelete.length}\n`)

  if (usersToDelete.length > 0) {
    const userIdsToDelete = usersToDelete.map(u => u.id)
    const profileIdsToDelete = usersToDelete
      .map(u => u.profile?.id)
      .filter((id): id is string => !!id)

    console.log('Eliminando datos relacionados...\n')

    // Eliminar fotos de perfiles a eliminar
    if (profileIdsToDelete.length > 0) {
      const deletedPhotos = await prisma.photo.deleteMany({
        where: {
          profileId: { in: profileIdsToDelete },
        },
      })
      console.log(`✅ Eliminadas ${deletedPhotos.count} fotos`)
    }

    // Eliminar likes relacionados
    if (profileIdsToDelete.length > 0) {
      const deletedLikes = await prisma.like.deleteMany({
        where: {
          OR: [
            { fromProfileId: { in: profileIdsToDelete } },
            { toProfileId: { in: profileIdsToDelete } },
          ],
        },
      })
      console.log(`✅ Eliminados ${deletedLikes.count} likes`)
    }

    // Eliminar mensajes relacionados
    if (profileIdsToDelete.length > 0) {
      const deletedMessages = await prisma.message.deleteMany({
        where: {
          OR: [
            { fromProfileId: { in: profileIdsToDelete } },
            { toProfileId: { in: profileIdsToDelete } },
          ],
        },
      })
      console.log(`✅ Eliminados ${deletedMessages.count} mensajes`)
    }

    // Eliminar favoritos relacionados
    if (profileIdsToDelete.length > 0) {
      const deletedFavorites = await prisma.favorite.deleteMany({
        where: {
          OR: [
            { ownerProfileId: { in: profileIdsToDelete } },
            { targetProfileId: { in: profileIdsToDelete } },
          ],
        },
      })
      console.log(`✅ Eliminados ${deletedFavorites.count} favoritos`)
    }

    // Eliminar bloques relacionados
    if (profileIdsToDelete.length > 0) {
      const deletedBlocks = await prisma.block.deleteMany({
        where: {
          OR: [
            { blockerProfileId: { in: profileIdsToDelete } },
            { blockedProfileId: { in: profileIdsToDelete } },
          ],
        },
      })
      console.log(`✅ Eliminados ${deletedBlocks.count} bloques`)
    }

    // Eliminar perfiles
    if (profileIdsToDelete.length > 0) {
      const deletedProfiles = await prisma.profile.deleteMany({
        where: {
          id: { in: profileIdsToDelete },
        },
      })
      console.log(`✅ Eliminados ${deletedProfiles.count} perfiles`)
    }

    // Eliminar suscripciones relacionadas
    const deletedSubscriptions = await prisma.subscription.deleteMany({
      where: {
        userId: { in: userIdsToDelete },
      },
    })
    console.log(`✅ Eliminadas ${deletedSubscriptions.count} suscripciones`)

    // Eliminar tokens de verificación de email
    const deletedTokens = await prisma.emailVerificationToken.deleteMany({
      where: {
        userId: { in: userIdsToDelete },
      },
    })
    console.log(`✅ Eliminados ${deletedTokens.count} tokens de verificación`)

    // Eliminar sesiones de Roam
    if (profileIdsToDelete.length > 0) {
      const deletedRoamSessions = await prisma.roamSession.deleteMany({
        where: {
          profileId: { in: profileIdsToDelete },
        },
      })
      console.log(`✅ Eliminadas ${deletedRoamSessions.count} sesiones de Roam`)
    }

    // Eliminar compras de Roam
    if (profileIdsToDelete.length > 0) {
      const deletedRoamPurchases = await prisma.roamPurchase.deleteMany({
        where: {
          profileId: { in: profileIdsToDelete },
        },
      })
      console.log(`✅ Eliminadas ${deletedRoamPurchases.count} compras de Roam`)
    }

    // Eliminar accesos a fotos privadas
    if (profileIdsToDelete.length > 0) {
      const deletedPhotoAccess = await prisma.privatePhotoAccess.deleteMany({
        where: {
          OR: [
            { ownerProfileId: { in: profileIdsToDelete } },
            { viewerProfileId: { in: profileIdsToDelete } },
          ],
        },
      })
      console.log(`✅ Eliminados ${deletedPhotoAccess.count} accesos a fotos privadas`)
    }

    // Eliminar usuarios
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: { in: userIdsToDelete },
      },
    })
    console.log(`✅ Eliminados ${deletedUsers.count} usuarios\n`)

    console.log('✅ Proceso completado exitosamente')
  } else {
    console.log('ℹ️  No hay usuarios para eliminar')
  }

  // Mostrar usuarios restantes
  const remainingUsers = await prisma.user.findMany({
    select: {
      email: true,
      profile: {
        select: {
          title: true,
          isFake: true,
        },
      },
    },
  })

  console.log(`\n📋 Usuarios restantes (${remainingUsers.length}):`)
  remainingUsers.forEach(user => {
    console.log(`  - ${user.email} ${user.profile ? `(${user.profile.title})` : '(sin perfil)'} ${user.profile?.isFake ? '[FAKE]' : ''}`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

