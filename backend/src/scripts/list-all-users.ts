import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📋 Listando todos los usuarios en la base de datos...\n')

  const users = await prisma.user.findMany({
    include: {
      profile: {
        select: {
          id: true,
          title: true,
          isFake: true,
          city: true,
          orientation: true,
          gender: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`Total de usuarios: ${users.length}\n`)

  if (users.length === 0) {
    console.log('No hay usuarios en la base de datos')
  } else {
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`)
      if (user.profile) {
        console.log(`   Perfil ID: ${user.profile.id}`)
        console.log(`   Título: ${user.profile.title}`)
        console.log(`   Tipo: ${user.profile.isFake ? '[FAKE]' : '[REAL]'}`)
        console.log(`   Ciudad: ${user.profile.city || 'No definida'}`)
        console.log(`   Orientación: ${user.profile.orientation}`)
        console.log(`   Género: ${user.profile.gender || 'No definido'}`)
      } else {
        console.log(`   Sin perfil`)
      }
      console.log('')
    })
  }

  // Buscar específicamente los emails mencionados (case-insensitive)
  console.log('\n🔍 Buscando emails específicos...\n')
  const targetEmails = ['agutierrez3b1415@gmail.com', 'hola@gmail.com']
  
  for (const email of targetEmails) {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        profile: true,
      },
    })
    
    if (user) {
      console.log(`✅ Encontrado: ${user.email}`)
    } else {
      console.log(`❌ No encontrado: ${email}`)
    }
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

