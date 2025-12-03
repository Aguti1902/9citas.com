import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllUsers() {
  try {
    console.log('🔍 Listando TODOS los usuarios en la base de datos...\n');

    // Obtener TODOS los usuarios
    const users = await prisma.user.findMany({
      include: {
        profile: {
          select: {
            id: true,
            title: true,
            gender: true,
            orientation: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total de usuarios: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log('📋 Lista completa de usuarios:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Registrado: ${user.createdAt.toISOString()}`);
      console.log(`   - Email verificado: ${user.emailVerified ? 'Sí' : 'No'}`);
      if (user.profile) {
        console.log(`   - ✅ TIENE PERFIL:`);
        console.log(`      * Nombre: ${user.profile.title}`);
        console.log(`      * Género: ${user.profile.gender || 'NO DEFINIDO'}`);
        console.log(`      * Orientación: ${user.profile.orientation || 'NO DEFINIDO'}`);
        console.log(`      * Ciudad: ${user.profile.city || 'NO DEFINIDO'}`);
      } else {
        console.log(`   - ❌ NO TIENE PERFIL (solo se registró, no completó el perfil)`);
      }
      console.log('');
    });

    // Estadísticas
    const usersWithProfile = users.filter(u => u.profile);
    const usersWithoutProfile = users.filter(u => !u.profile);
    
    console.log('\n📊 Estadísticas:');
    console.log(`   - Usuarios con perfil: ${usersWithProfile.length}`);
    console.log(`   - Usuarios sin perfil: ${usersWithoutProfile.length}`);

    if (usersWithProfile.length > 0) {
      const profiles = usersWithProfile.map(u => u.profile!);
      const hombres = profiles.filter(p => p.gender === 'hombre');
      const mujeres = profiles.filter(p => p.gender === 'mujer');
      const hetero = profiles.filter(p => p.orientation === 'hetero');
      const gay = profiles.filter(p => p.orientation === 'gay');

      console.log('\n📊 Distribución de perfiles:');
      console.log(`   - Hombres: ${hombres.length}`);
      console.log(`   - Mujeres: ${mujeres.length}`);
      console.log(`   - Hetero: ${hetero.length}`);
      console.log(`   - Gay: ${gay.length}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();
