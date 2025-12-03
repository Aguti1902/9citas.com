import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugProfileSearch() {
  try {
    console.log('🔍 DIAGNÓSTICO DE BÚSQUEDA DE PERFILES\n');
    console.log('='.repeat(60));

    // Obtener TODOS los perfiles
    const allProfiles = await prisma.profile.findMany({
      include: {
        photos: true,
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`\n📊 Total de perfiles: ${allProfiles.length}\n`);

    if (allProfiles.length === 0) {
      console.log('❌ NO HAY PERFILES EN LA BASE DE DATOS');
      return;
    }

    // Mostrar TODOS los perfiles con sus detalles
    console.log('📋 TODOS LOS PERFILES:\n');
    allProfiles.forEach((profile, index) => {
      const hasCoverPhoto = profile.photos.some(p => p.type === 'cover');
      const isReal = profile.isFake === false || profile.isFake === null;
      
      console.log(`${index + 1}. ${profile.title || 'Sin nombre'}`);
      console.log(`   - Email: ${profile.user?.email || 'Sin email'}`);
      console.log(`   - ID: ${profile.id}`);
      console.log(`   - Género: ${profile.gender || '❌ NO DEFINIDO'}`);
      console.log(`   - Orientación: ${profile.orientation || '❌ NO DEFINIDO'}`);
      console.log(`   - Ciudad: ${profile.city || 'No definida'}`);
      console.log(`   - isFake: ${profile.isFake}`);
      console.log(`   - Fotos: ${profile.photos.length} (Portada: ${hasCoverPhoto ? '✅' : '❌'})`);
      
      // Verificar si aparecería en búsqueda
      const issues: string[] = [];
      if (!profile.gender) issues.push('Sin género');
      if (!profile.orientation) issues.push('Sin orientación');
      if (!hasCoverPhoto) issues.push('Sin foto de portada');
      if (profile.isFake === true) issues.push('Marcado como fake');
      
      if (issues.length > 0) {
        console.log(`   ⚠️  PROBLEMAS: ${issues.join(', ')}`);
      } else {
        console.log(`   ✅ Perfil válido`);
      }
      console.log('');
    });

    // Agrupar por género y orientación
    const hombresHetero = allProfiles.filter(p => 
      p.gender === 'hombre' && 
      p.orientation === 'hetero' &&
      (p.isFake === false || p.isFake === null) &&
      p.photos.some(photo => photo.type === 'cover')
    );

    const mujeresHetero = allProfiles.filter(p => 
      p.gender === 'mujer' && 
      p.orientation === 'hetero' &&
      (p.isFake === false || p.isFake === null) &&
      p.photos.some(photo => photo.type === 'cover')
    );

    console.log('\n📊 PERFILES VÁLIDOS PARA BÚSQUEDA:');
    console.log(`   - Hombres hetero: ${hombresHetero.length}`);
    console.log(`   - Mujeres hetero: ${mujeresHetero.length}\n`);

    // Simular búsqueda para hombre hetero
    console.log('🔍 SIMULACIÓN: Hombre hetero buscando perfiles\n');
    console.log(`   ✅ Debería ver: ${mujeresHetero.length} perfiles de mujeres hetero`);
    if (mujeresHetero.length > 0) {
      console.log('   Perfiles disponibles:');
      mujeresHetero.forEach(p => {
        console.log(`      - ${p.title} (${p.user?.email || 'sin email'}) - ${p.city}`);
      });
    } else {
      console.log('   ❌ NO HAY PERFILES DISPONIBLES');
      console.log('   Razones posibles:');
      const mujeresSinGenero = allProfiles.filter(p => p.gender !== 'mujer' && p.orientation === 'hetero');
      const mujeresSinOrientacion = allProfiles.filter(p => p.gender === 'mujer' && p.orientation !== 'hetero');
      const mujeresSinPortada = allProfiles.filter(p => p.gender === 'mujer' && p.orientation === 'hetero' && !p.photos.some(photo => photo.type === 'cover'));
      const mujeresFake = allProfiles.filter(p => p.gender === 'mujer' && p.orientation === 'hetero' && p.isFake === true);
      
      if (mujeresSinGenero.length > 0) console.log(`      - ${mujeresSinGenero.length} perfiles con género incorrecto`);
      if (mujeresSinOrientacion.length > 0) console.log(`      - ${mujeresSinOrientacion.length} perfiles con orientación incorrecta`);
      if (mujeresSinPortada.length > 0) console.log(`      - ${mujeresSinPortada.length} perfiles sin foto de portada`);
      if (mujeresFake.length > 0) console.log(`      - ${mujeresFake.length} perfiles marcados como fake`);
    }

    // Simular búsqueda para mujer hetero
    console.log('\n🔍 SIMULACIÓN: Mujer hetero buscando perfiles\n');
    console.log(`   ✅ Debería ver: ${hombresHetero.length} perfiles de hombres hetero`);
    if (hombresHetero.length > 0) {
      console.log('   Perfiles disponibles:');
      hombresHetero.forEach(p => {
        console.log(`      - ${p.title} (${p.user?.email || 'sin email'}) - ${p.city}`);
      });
    } else {
      console.log('   ❌ NO HAY PERFILES DISPONIBLES');
    }

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProfileSearch();

