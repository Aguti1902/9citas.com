import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Eliminando TODOS los perfiles falsos...\n')

  // Obtener TODOS los perfiles falsos
  const fakeProfiles = await prisma.profile.findMany({
    where: { isFake: true },
    select: { id: true },
  })

  console.log(`📊 Encontrados ${fakeProfiles.length} perfiles falsos para eliminar\n`)

  if (fakeProfiles.length > 0) {
    const fakeProfileIds = fakeProfiles.map(p => p.id)

    // Eliminar todas las fotos
    const deletedPhotos = await prisma.photo.deleteMany({
      where: {
        profileId: { in: fakeProfileIds },
      },
    })
    console.log(`✅ Eliminadas ${deletedPhotos.count} fotos`)

    // Eliminar likes
    const deletedLikes = await prisma.like.deleteMany({
      where: {
        OR: [
          { fromProfileId: { in: fakeProfileIds } },
          { toProfileId: { in: fakeProfileIds } },
        ],
      },
    })
    console.log(`✅ Eliminados ${deletedLikes.count} likes`)

    // Eliminar mensajes
    const deletedMessages = await prisma.message.deleteMany({
      where: {
        OR: [
          { fromProfileId: { in: fakeProfileIds } },
          { toProfileId: { in: fakeProfileIds } },
        ],
      },
    })
    console.log(`✅ Eliminados ${deletedMessages.count} mensajes`)

    // Eliminar perfiles
    const deletedProfiles = await prisma.profile.deleteMany({
      where: { isFake: true },
    })
    console.log(`✅ Eliminados ${deletedProfiles.count} perfiles`)

    // Eliminar usuarios asociados (buscar por email fake o por perfil fake)
    const fakeUsers = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: '@fake.9citas.com',
            },
          },
          {
            profile: {
              isFake: true,
            },
          },
        ],
      },
      select: { id: true },
    })

    if (fakeUsers.length > 0) {
      const deletedUsers = await prisma.user.deleteMany({
        where: {
          id: { in: fakeUsers.map(u => u.id) },
        },
      })
      console.log(`✅ Eliminados ${deletedUsers.count} usuarios fake`)
    } else {
      console.log(`✅ No se encontraron usuarios fake adicionales`)
    }
    
    console.log('')

    console.log('✅ Todos los perfiles falsos eliminados exitosamente')
  } else {
    console.log('ℹ️  No se encontraron perfiles falsos para eliminar')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

