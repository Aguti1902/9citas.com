import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Eliminando todos los perfiles excepto los 7 reales de mujeres...\n');

  // Obtener los 7 perfiles que queremos mantener (los que tienen personalidad)
  const profilesToKeep = await prisma.profile.findMany({
    where: {
      personality: { not: null },
    },
    select: { id: true, title: true },
  });

  console.log(`📌 Perfiles a mantener (${profilesToKeep.length}):`);
  profilesToKeep.forEach(p => console.log(`   - ${p.title} (${p.id})`));
  console.log('');

  if (profilesToKeep.length === 0) {
    console.log('⚠️  No se encontraron perfiles con personalidad. No se eliminará nada.');
    return;
  }

  const keepIds = profilesToKeep.map(p => p.id);

  // Obtener todos los perfiles
  const allProfiles = await prisma.profile.findMany({
    select: { id: true, title: true, userId: true },
  });

  console.log(`📊 Total de perfiles en la base de datos: ${allProfiles.length}`);

  // Filtrar perfiles a eliminar
  const profilesToDelete = allProfiles.filter(p => !keepIds.includes(p.id));

  console.log(`🗑️  Perfiles a eliminar: ${profilesToDelete.length}\n`);

  if (profilesToDelete.length === 0) {
    console.log('✅ No hay perfiles para eliminar');
    return;
  }

  const deleteIds = profilesToDelete.map(p => p.id);
  const deleteUserIds = profilesToDelete
    .map(p => p.userId)
    .filter((id): id is string => id !== null);

  // Eliminar en orden correcto (primero relaciones, luego perfiles, luego usuarios)
  console.log('🗑️  Eliminando relaciones...');
  
  await prisma.photo.deleteMany({
    where: { profileId: { in: deleteIds } },
  });
  
  await prisma.like.deleteMany({
    where: {
      OR: [
        { fromProfileId: { in: deleteIds } },
        { toProfileId: { in: deleteIds } },
      ],
    },
  });
  
  await prisma.message.deleteMany({
    where: {
      OR: [
        { fromProfileId: { in: deleteIds } },
        { toProfileId: { in: deleteIds } },
      ],
    },
  });

  await prisma.favorite.deleteMany({
    where: {
      OR: [
        { ownerProfileId: { in: deleteIds } },
        { targetProfileId: { in: deleteIds } },
      ],
    },
  });

  await prisma.block.deleteMany({
    where: {
      OR: [
        { blockerProfileId: { in: deleteIds } },
        { blockedProfileId: { in: deleteIds } },
      ],
    },
  });

  console.log('🗑️  Eliminando perfiles...');
  await prisma.profile.deleteMany({
    where: { id: { in: deleteIds } },
  });

  console.log('🗑️  Eliminando usuarios...');
  if (deleteUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: deleteUserIds } },
    });
  }

  console.log(`\n✅ ${profilesToDelete.length} perfiles eliminados exitosamente`);
  console.log(`✅ ${profilesToKeep.length} perfiles mantenidos`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

