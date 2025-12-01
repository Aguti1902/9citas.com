import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando perfiles en la base de datos...\n')

  // Obtener todos los perfiles
  const profiles = await prisma.profile.findMany({
    include: {
      photos: {
        where: { type: 'cover' },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`📊 Total de perfiles: ${profiles.length}\n`)

  // Agrupar por orientación y género
  const heteroHombres = profiles.filter(p => p.orientation === 'hetero' && p.gender === 'hombre')
  const heteroMujeres = profiles.filter(p => p.orientation === 'hetero' && p.gender === 'mujer')
  const gayHombres = profiles.filter(p => p.orientation === 'gay' && p.gender === 'hombre')
  const gayMujeres = profiles.filter(p => p.orientation === 'gay' && p.gender === 'mujer')
  const sinGenero = profiles.filter(p => !p.gender)

  console.log('📈 Distribución:')
  console.log(`  - Hetero Hombres: ${heteroHombres.length}`)
  console.log(`  - Hetero Mujeres: ${heteroMujeres.length}`)
  console.log(`  - Gay Hombres: ${gayHombres.length}`)
  console.log(`  - Gay Mujeres: ${gayMujeres.length}`)
  console.log(`  - Sin género: ${sinGenero.length}\n`)

  // Mostrar detalles de cada perfil
  console.log('👥 Detalles de perfiles:\n')
  for (const profile of profiles) {
    const hasCoverPhoto = profile.photos.length > 0
    console.log(`  ${profile.title || 'Sin título'} (ID: ${profile.id})`)
    console.log(`    - Email: ${profile.user.email}`)
    console.log(`    - Orientación: ${profile.orientation || 'NO DEFINIDA'}`)
    console.log(`    - Género: ${profile.gender || 'NO DEFINIDO ⚠️'}`)
    console.log(`    - Ciudad: ${profile.city || 'NO DEFINIDA'}`)
    console.log(`    - Foto de portada: ${hasCoverPhoto ? '✅' : '❌'}`)
    console.log(`    - Es fake: ${profile.isFake ? 'Sí' : 'No'}`)
    console.log('')
  }

  // Verificar matching
  console.log('\n🔗 Verificación de matching:\n')
  for (const profile of profiles) {
    if (profile.isFake) continue // Saltar perfiles falsos

    let compatibleProfiles: typeof profiles = []
    
    if (profile.orientation === 'hetero') {
      if (profile.gender === 'hombre') {
        compatibleProfiles = heteroMujeres.filter(p => p.id !== profile.id)
      } else if (profile.gender === 'mujer') {
        compatibleProfiles = heteroHombres.filter(p => p.id !== profile.id)
      }
    } else if (profile.orientation === 'gay') {
      if (profile.gender === 'hombre') {
        compatibleProfiles = gayHombres.filter(p => p.id !== profile.id)
      } else if (profile.gender === 'mujer') {
        compatibleProfiles = gayMujeres.filter(p => p.id !== profile.id)
      }
    }

    // Filtrar solo los que tienen foto de portada
    const withCoverPhoto = compatibleProfiles.filter(p => p.photos.length > 0)
    
    // Filtrar por ciudad (simulando usuario free)
    const sameCity = withCoverPhoto.filter(p => 
      p.city?.toLowerCase() === profile.city?.toLowerCase()
    )

    console.log(`  ${profile.title || profile.id} (${profile.orientation}, ${profile.gender || 'SIN GÉNERO'})`)
    console.log(`    Ciudad: ${profile.city || 'NO DEFINIDA'}`)
    console.log(`    Compatibles totales: ${compatibleProfiles.length}`)
    console.log(`    Con foto de portada: ${withCoverPhoto.length}`)
    console.log(`    En la misma ciudad: ${sameCity.length}`)
    
    if (sameCity.length > 0) {
      console.log(`    ✅ DEBERÍA VER: ${sameCity.map(p => `${p.title || p.id} (${p.city})`).join(', ')}`)
    } else if (withCoverPhoto.length > 0) {
      console.log(`    ⚠️  Hay ${withCoverPhoto.length} perfiles compatibles pero en ciudades diferentes`)
      console.log(`    (Si eres 9Plus, los verías: ${withCoverPhoto.map(p => `${p.title || p.id} (${p.city})`).join(', ')})`)
    } else {
      console.log(`    ❌ No hay perfiles compatibles con foto de portada`)
    }

    // Verificar likes enviados
    const sentLikes = await prisma.like.findMany({
      where: { fromProfileId: profile.id },
      select: { toProfileId: true },
    })
    const likedIds = sentLikes.map(l => l.toProfileId)
    
    // Verificar likes recibidos (matches)
    const receivedLikes = await prisma.like.findMany({
      where: { toProfileId: profile.id },
      select: { fromProfileId: true },
    })
    const likedByIds = receivedLikes.map(l => l.fromProfileId)
    
    // Verificar matches (like mutuo)
    const matches = sameCity.filter(p => 
      likedIds.includes(p.id) && likedByIds.includes(p.id)
    )
    
    if (likedIds.length > 0) {
      const likedProfiles = sameCity.filter(p => likedIds.includes(p.id))
      if (likedProfiles.length > 0) {
        console.log(`    ⚠️  Ya diste like a: ${likedProfiles.map(p => p.title || p.id).join(', ')} (no aparecerán en tu feed)`)
      }
    }
    
    if (matches.length > 0) {
      console.log(`    💚 MATCHES: ${matches.map(p => p.title || p.id).join(', ')} (pueden chatear)`)
    }
    
    // Mostrar perfiles que SÍ debería ver (sin likes previos)
    const shouldSeeNow = sameCity.filter(p => !likedIds.includes(p.id))
    if (shouldSeeNow.length > 0) {
      console.log(`    👀 DEBERÍA VER AHORA: ${shouldSeeNow.map(p => `${p.title || p.id} (${p.city})`).join(', ')}`)
    } else if (sameCity.length > 0) {
      console.log(`    ❌ No verá ningún perfil porque ya les diste like a todos`)
    }
    
    console.log('')
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

