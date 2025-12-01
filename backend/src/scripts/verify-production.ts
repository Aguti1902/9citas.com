import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 VERIFICACIÓN DE PRODUCCIÓN - 9citas.com\n')
  console.log('=' .repeat(50))
  
  // 1. Verificar conexión a base de datos
  console.log('\n1️⃣ Verificando conexión a base de datos...')
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Conexión a base de datos: OK')
  } catch (error) {
    console.log('❌ Error de conexión:', error)
    process.exit(1)
  }

  // 2. Verificar usuarios
  console.log('\n2️⃣ Verificando usuarios...')
  const totalUsers = await prisma.user.count()
  const usersWithProfiles = await prisma.user.count({
    where: { profile: { isNot: null } },
  })
  console.log(`   Total usuarios: ${totalUsers}`)
  console.log(`   Usuarios con perfil: ${usersWithProfiles}`)

  // 3. Verificar perfiles falsos
  console.log('\n3️⃣ Verificando perfiles falsos...')
  const fakeProfiles = await prisma.profile.count({
    where: { isFake: true },
  })
  const realProfiles = await prisma.profile.count({
    where: { isFake: false },
  })
  console.log(`   Perfiles falsos: ${fakeProfiles} ${fakeProfiles > 0 ? '⚠️' : '✅'}`)
  console.log(`   Perfiles reales: ${realProfiles}`)

  // 4. Verificar perfiles con fotos
  console.log('\n4️⃣ Verificando perfiles con fotos...')
  const profilesWithCover = await prisma.profile.count({
    where: {
      photos: {
        some: { type: 'cover' },
      },
    },
  })
  console.log(`   Perfiles con foto de portada: ${profilesWithCover}`)

  // 5. Verificar emails específicos
  console.log('\n5️⃣ Verificando emails específicos...')
  const targetEmails = ['agutierrez3b1415@gmail.com', 'hola@gmail.com']
  for (const email of targetEmails) {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: { profile: true },
    })
    if (user) {
      console.log(`   ✅ ${email} - ${user.profile ? `Perfil: ${user.profile.title}` : 'Sin perfil'}`)
    } else {
      console.log(`   ❌ ${email} - NO ENCONTRADO`)
    }
  }

  // 6. Verificar variables de entorno críticas
  console.log('\n6️⃣ Verificando variables de entorno...')
  const requiredVars = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ]
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value) {
      console.log(`   ✅ ${varName}: Configurada`)
    } else {
      console.log(`   ❌ ${varName}: NO CONFIGURADA`)
    }
  }

  // 7. Verificar CORS
  console.log('\n7️⃣ Verificando configuración CORS...')
  const frontendUrls = [
    'https://9citas-com-fyij.vercel.app',
    'https://9citas-com-hev9.vercel.app',
  ]
  console.log(`   URLs permitidas: ${frontendUrls.join(', ')}`)

  // 8. Resumen final
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN:')
  console.log(`   - Usuarios totales: ${totalUsers}`)
  console.log(`   - Perfiles reales: ${realProfiles}`)
  console.log(`   - Perfiles falsos: ${fakeProfiles} ${fakeProfiles === 0 ? '✅' : '⚠️'}`)
  console.log(`   - Perfiles con fotos: ${profilesWithCover}`)
  
  if (fakeProfiles === 0) {
    console.log('\n✅ Estado: LISTO PARA PRODUCCIÓN')
  } else {
    console.log('\n⚠️  ADVERTENCIA: Hay perfiles falsos en la base de datos')
    console.log('   Ejecuta: npx tsx src/scripts/delete-all-fake-profiles.ts')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

