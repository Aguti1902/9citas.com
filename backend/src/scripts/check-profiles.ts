import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProfiles() {
  try {
    console.log('🔍 Verificando TODOS los perfiles en la base de datos...\n');

    // Obtener TODOS los perfiles (no solo los asociados a usuarios)
    const allProfiles = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total de PERFILES en la base de datos: ${allProfiles.length}\n`);

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });

    console.log(`📊 Total de USUARIOS: ${users.length}\n`);

    // Usuarios sin perfil
    const usersWithoutProfile = users.filter(u => !u.profile);
    console.log(`❌ Usuarios SIN perfil (registrados pero no completaron perfil): ${usersWithoutProfile.length}`);
    if (usersWithoutProfile.length > 0) {
      console.log('\n   📧 Emails de usuarios sin perfil:');
      usersWithoutProfile.forEach((u, index) => {
        console.log(`      ${index + 1}. ${u.email} (registrado: ${u.createdAt.toISOString()})`);
      });
      console.log('\n   ⚠️  Estos usuarios se registraron pero NO completaron su perfil.');
      console.log('   Por eso NO aparecen en las búsquedas.\n');
    }

    // Usuarios con perfil
    const usersWithProfile = users.filter(u => u.profile);
    console.log(`\n✅ Usuarios CON perfil: ${usersWithProfile.length}`);

    // Mostrar TODOS los perfiles
    console.log('\n📋 Detalles de TODOS los perfiles:');
    for (const profile of allProfiles) {
      const coverPhoto = profile.photos.find(p => p.type === 'cover');
      const userEmail = profile.user?.email || 'SIN USUARIO ASOCIADO';

      console.log(`\n   👤 ${userEmail}`);
      console.log(`      - ID: ${profile.id}`);
      console.log(`      - Nombre: ${profile.title}`);
      console.log(`      - Género: ${profile.gender || 'NO DEFINIDO'}`);
      console.log(`      - Orientación: ${profile.orientation || 'NO DEFINIDO'}`);
      console.log(`      - Ciudad: ${profile.city || 'NO DEFINIDO'}`);
      console.log(`      - Edad: ${profile.age}`);
      console.log(`      - isFake: ${profile.isFake}`);
      console.log(`      - Fotos: ${profile.photos.length} (Portada: ${coverPhoto ? 'Sí' : 'NO'})`);
      console.log(`      - Última conexión: ${profile.lastSeenAt.toISOString()}`);

      // Verificar si aparecería en búsqueda
      const issues: string[] = [];
      if (!profile.gender) issues.push('Sin género');
      if (!profile.orientation) issues.push('Sin orientación');
      if (!profile.city) issues.push('Sin ciudad');
      if (!coverPhoto) issues.push('Sin foto de portada');
      if (profile.isFake === true) issues.push('Marcado como fake');

      if (issues.length > 0) {
        console.log(`      ⚠️  PROBLEMAS: ${issues.join(', ')}`);
      } else {
        console.log(`      ✅ Perfil completo`);
      }
    }

    // Verificar perfiles que deberían aparecer
    console.log('\n\n🔎 Verificando perfiles que deberían aparecer en búsqueda...\n');

    const validProfiles = allProfiles.filter(p => {
      const hasCoverPhoto = p.photos.some(photo => photo.type === 'cover');
      const isReal = p.isFake === false || p.isFake === null;
      const hasGender = !!p.gender;
      const hasOrientation = !!p.orientation;
      const hasCity = !!p.city;

      return hasCoverPhoto && isReal && hasGender && hasOrientation && hasCity;
    });

    console.log(`✅ Perfiles válidos (con foto de portada y datos completos): ${validProfiles.length}`);
    console.log(`❌ Perfiles inválidos: ${allProfiles.length - validProfiles.length}`);

    if (validProfiles.length > 0) {
      console.log('\n📊 Distribución por orientación y género:');
      const heteroMen = validProfiles.filter(p => p.orientation === 'hetero' && p.gender === 'hombre');
      const heteroWomen = validProfiles.filter(p => p.orientation === 'hetero' && p.gender === 'mujer');
      const gayMen = validProfiles.filter(p => p.orientation === 'gay' && p.gender === 'hombre');
      const gayWomen = validProfiles.filter(p => p.orientation === 'gay' && p.gender === 'mujer');

      console.log(`   - Hetero Hombres: ${heteroMen.length}`);
      console.log(`   - Hetero Mujeres: ${heteroWomen.length}`);
      console.log(`   - Gay Hombres: ${gayMen.length}`);
      console.log(`   - Gay Mujeres: ${gayWomen.length}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProfiles();
