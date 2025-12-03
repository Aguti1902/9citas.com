import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseSearch() {
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
    });

    console.log(`\n📊 Total de perfiles en la base de datos: ${allProfiles.length}\n`);

    // Agrupar por género y orientación
    const hombresHetero = allProfiles.filter(p => p.gender === 'hombre' && p.orientation === 'hetero');
    const mujeresHetero = allProfiles.filter(p => p.gender === 'mujer' && p.orientation === 'hetero');
    const hombresGay = allProfiles.filter(p => p.gender === 'hombre' && p.orientation === 'gay');
    const mujeresGay = allProfiles.filter(p => p.gender === 'mujer' && p.orientation === 'gay');

    console.log('📋 Distribución de perfiles:');
    console.log(`   - Hombres hetero: ${hombresHetero.length}`);
    console.log(`   - Mujeres hetero: ${mujeresHetero.length}`);
    console.log(`   - Hombres gay: ${hombresGay.length}`);
    console.log(`   - Mujeres gay: ${mujeresGay.length}\n`);

    // Verificar perfiles con foto de portada
    const perfilesConPortada = allProfiles.filter(p => 
      p.photos.some(photo => photo.type === 'cover')
    );
    const perfilesSinPortada = allProfiles.filter(p => 
      !p.photos.some(photo => photo.type === 'cover')
    );

    console.log('📸 Perfiles con/sin foto de portada:');
    console.log(`   - Con foto de portada: ${perfilesConPortada.length}`);
    console.log(`   - Sin foto de portada: ${perfilesSinPortada.length}\n`);

    if (perfilesSinPortada.length > 0) {
      console.log('❌ Perfiles SIN foto de portada (NO aparecerán en búsqueda):');
      perfilesSinPortada.forEach(p => {
        console.log(`   - ${p.title} (${p.user?.email || 'sin email'}) - Género: ${p.gender}, Orientación: ${p.orientation}`);
      });
      console.log('');
    }

    // Verificar perfiles fake
    const perfilesFake = allProfiles.filter(p => p.isFake === true);
    const perfilesReales = allProfiles.filter(p => p.isFake === false || p.isFake === null);

    console.log('👥 Perfiles reales vs fake:');
    console.log(`   - Reales: ${perfilesReales.length}`);
    console.log(`   - Fake: ${perfilesFake.length}\n`);

    // Simular búsqueda para hombre hetero
    console.log('🔍 SIMULACIÓN: Hombre hetero buscando perfiles\n');
    const perfilesParaHombreHetero = perfilesReales.filter(p => 
      p.gender === 'mujer' && 
      p.orientation === 'hetero' &&
      p.photos.some(photo => photo.type === 'cover')
    );
    console.log(`   ✅ Debería ver: ${perfilesParaHombreHetero.length} perfiles`);
    if (perfilesParaHombreHetero.length > 0) {
      console.log('   Perfiles:');
      perfilesParaHombreHetero.forEach(p => {
        console.log(`      - ${p.title} (${p.user?.email || 'sin email'}) - ${p.city}`);
      });
    } else {
      console.log('   ❌ NO HAY PERFILES DISPONIBLES');
    }

    // Simular búsqueda para mujer hetero
    console.log('\n🔍 SIMULACIÓN: Mujer hetero buscando perfiles\n');
    const perfilesParaMujerHetero = perfilesReales.filter(p => 
      p.gender === 'hombre' && 
      p.orientation === 'hetero' &&
      p.photos.some(photo => photo.type === 'cover')
    );
    console.log(`   ✅ Debería ver: ${perfilesParaMujerHetero.length} perfiles`);
    if (perfilesParaMujerHetero.length > 0) {
      console.log('   Perfiles:');
      perfilesParaMujerHetero.forEach(p => {
        console.log(`      - ${p.title} (${p.user?.email || 'sin email'}) - ${p.city}`);
      });
    } else {
      console.log('   ❌ NO HAY PERFILES DISPONIBLES');
    }

    // Verificar problemas comunes
    console.log('\n⚠️  PROBLEMAS DETECTADOS:\n');
    const problemas: string[] = [];

    allProfiles.forEach(p => {
      const issues: string[] = [];
      if (!p.gender) issues.push('Sin género');
      if (!p.orientation) issues.push('Sin orientación');
      if (!p.city) issues.push('Sin ciudad');
      if (!p.photos.some(photo => photo.type === 'cover')) issues.push('Sin foto de portada');
      if (p.isFake === true) issues.push('Marcado como fake');

      if (issues.length > 0) {
        problemas.push(`${p.title} (${p.user?.email || 'sin email'}): ${issues.join(', ')}`);
      }
    });

    if (problemas.length > 0) {
      problemas.forEach(p => console.log(`   - ${p}`));
    } else {
      console.log('   ✅ No se detectaron problemas');
    }

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseSearch();

