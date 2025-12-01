import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Eliminando TODOS los perfiles fake y sus datos relacionados...\n');

  // Obtener todos los perfiles que NO son los 7 reales (los que tienen personalidad)
  const realProfiles = await prisma.profile.findMany({
    where: {
      personality: { not: null },
    },
    select: { id: true, title: true },
  });

  console.log(`📌 Perfiles reales a mantener (${realProfiles.length}):`);
  realProfiles.forEach(p => console.log(`   - ${p.title} (${p.id})`));
  console.log('');

  if (realProfiles.length === 0) {
    console.log('⚠️  No se encontraron perfiles reales. No se eliminará nada.');
    return;
  }

  const keepProfileIds = realProfiles.map(p => p.id);

  // Obtener todos los perfiles
  const allProfiles = await prisma.profile.findMany({
    select: { id: true, title: true, userId: true, isFake: true, personality: true },
  });

  console.log(`📊 Total de perfiles en la base de datos: ${allProfiles.length}`);

  // Filtrar perfiles a eliminar (todos excepto los reales)
  const profilesToDelete = allProfiles.filter(p => !keepProfileIds.includes(p.id));

  console.log(`🗑️  Perfiles a eliminar: ${profilesToDelete.length}\n`);

  if (profilesToDelete.length === 0) {
    console.log('✅ No hay perfiles para eliminar');
    return;
  }

  const deleteProfileIds = profilesToDelete.map(p => p.id);
  const deleteUserIds = profilesToDelete
    .map(p => p.userId)
    .filter((id): id is string => id !== null);

  console.log('🗑️  Eliminando relaciones...');
  
  // Eliminar fotos
  const deletedPhotos = await prisma.photo.deleteMany({
    where: { profileId: { in: deleteProfileIds } },
  });
  console.log(`   ✓ ${deletedPhotos.count} fotos eliminadas`);
  
  // Eliminar likes
  const deletedLikes = await prisma.like.deleteMany({
    where: {
      OR: [
        { fromProfileId: { in: deleteProfileIds } },
        { toProfileId: { in: deleteProfileIds } },
      ],
    },
  });
  console.log(`   ✓ ${deletedLikes.count} likes eliminados`);
  
  // Eliminar mensajes
  const deletedMessages = await prisma.message.deleteMany({
    where: {
      OR: [
        { fromProfileId: { in: deleteProfileIds } },
        { toProfileId: { in: deleteProfileIds } },
      ],
    },
  });
  console.log(`   ✓ ${deletedMessages.count} mensajes eliminados`);

  // Eliminar favoritos
  const deletedFavorites = await prisma.favorite.deleteMany({
    where: {
      OR: [
        { ownerProfileId: { in: deleteProfileIds } },
        { targetProfileId: { in: deleteProfileIds } },
      ],
    },
  });
  console.log(`   ✓ ${deletedFavorites.count} favoritos eliminados`);

  // Eliminar bloqueos
  const deletedBlocks = await prisma.block.deleteMany({
    where: {
      OR: [
        { blockerProfileId: { in: deleteProfileIds } },
        { blockedProfileId: { in: deleteProfileIds } },
      ],
    },
  });
  console.log(`   ✓ ${deletedBlocks.count} bloqueos eliminados`);

  // Eliminar acceso a fotos privadas
  const deletedPrivatePhotoAccess = await prisma.privatePhotoAccess.deleteMany({
    where: {
      OR: [
        { viewerProfileId: { in: deleteProfileIds } },
        { ownerProfileId: { in: deleteProfileIds } },
      ],
    },
  });
  console.log(`   ✓ ${deletedPrivatePhotoAccess.count} accesos a fotos privadas eliminados`);

  // Eliminar sesiones de Roam
  const deletedRoamSessions = await prisma.roamSession.deleteMany({
    where: { profileId: { in: deleteProfileIds } },
  });
  console.log(`   ✓ ${deletedRoamSessions.count} sesiones de Roam eliminadas`);

  // Eliminar compras de Roam
  const deletedRoamPurchases = await prisma.roamPurchase.deleteMany({
    where: { profileId: { in: deleteProfileIds } },
  });
  console.log(`   ✓ ${deletedRoamPurchases.count} compras de Roam eliminadas`);

  console.log('\n🗑️  Eliminando perfiles...');
  const deletedProfiles = await prisma.profile.deleteMany({
    where: { id: { in: deleteProfileIds } },
  });
  console.log(`   ✓ ${deletedProfiles.count} perfiles eliminados`);

  console.log('\n🗑️  Eliminando usuarios...');
  if (deleteUserIds.length > 0) {
    // Eliminar suscripciones primero
    await prisma.subscription.deleteMany({
      where: { userId: { in: deleteUserIds } },
    });

    // Eliminar tokens de verificación de email
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: { in: deleteUserIds } },
    });

    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: deleteUserIds } },
    });
    console.log(`   ✓ ${deletedUsers.count} usuarios eliminados`);
  }

  console.log(`\n✅ ${profilesToDelete.length} perfiles fake eliminados exitosamente`);
  console.log(`✅ ${realProfiles.length} perfiles reales mantenidos`);
  
  // Verificar resultado final
  const remainingProfiles = await prisma.profile.findMany({
    select: { id: true, title: true },
  });
  console.log(`\n📊 Perfiles restantes: ${remainingProfiles.length}`);
  remainingProfiles.forEach(p => console.log(`   - ${p.title}`));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
