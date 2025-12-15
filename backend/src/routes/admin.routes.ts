import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Rutas existentes (requieren autenticación de admin)
router.post('/profiles', authenticateAdmin, adminController.getAllProfiles);
router.post('/regenerate-fakes', authenticateAdmin, adminController.regenerateFakeProfiles);
router.post('/delete-fakes', authenticateAdmin, adminController.deleteFakeProfiles);
router.post('/stats', authenticateAdmin, adminController.getStats);

// ENDPOINT TEMPORAL PARA LIMPIAR BASE DE DATOS
// ⚠️ SIN AUTENTICACIÓN - ELIMINAR DESPUÉS DE USAR ⚠️
router.post('/clear-all-data', async (req, res) => {
  try {
    console.log('🗑️  ========================================');
    console.log('🗑️  LIMPIANDO BASE DE DATOS DE PRODUCCIÓN');
    console.log('🗑️  ========================================\n');

    // Contar registros antes de eliminar
    const userCount = await prisma.user.count();
    const profileCount = await prisma.profile.count();
    const photoCount = await prisma.photo.count();
    const likeCount = await prisma.like.count();
    const favoriteCount = await prisma.favorite.count();
    const messageCount = await prisma.message.count();
    const subscriptionCount = await prisma.subscription.count();

    console.log('📊 Registros actuales:');
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Perfiles: ${profileCount}`);
    console.log(`   - Fotos: ${photoCount}`);
    console.log(`   - Likes: ${likeCount}`);
    console.log(`   - Favoritos: ${favoriteCount}`);
    console.log(`   - Mensajes: ${messageCount}`);
    console.log(`   - Suscripciones: ${subscriptionCount}\n`);

    if (userCount === 0 && profileCount === 0) {
      console.log('✅ La base de datos ya está vacía\n');
      return res.json({
        success: true,
        message: 'La base de datos ya está vacía',
        counts: {
          users: userCount,
          profiles: profileCount,
          photos: photoCount,
          likes: likeCount,
          favorites: favoriteCount,
          messages: messageCount,
          subscriptions: subscriptionCount
        }
      });
    }

    console.log('⏳ Eliminando todos los registros...\n');

    // Eliminar en orden (aunque con CASCADE no es necesario, lo hacemos por claridad)
    
    // 1. Eliminar tokens
    const deletedEmailTokens = await prisma.emailVerificationToken.deleteMany({});
    console.log(`   ✅ ${deletedEmailTokens.count} tokens de email eliminados`);

    const deletedPasswordTokens = await prisma.passwordResetToken.deleteMany({});
    console.log(`   ✅ ${deletedPasswordTokens.count} tokens de contraseña eliminados`);

    // 2. Eliminar relaciones
    const deletedReports = await prisma.report.deleteMany({});
    console.log(`   ✅ ${deletedReports.count} reportes eliminados`);

    const deletedBlocks = await prisma.block.deleteMany({});
    console.log(`   ✅ ${deletedBlocks.count} bloqueos eliminados`);

    const deletedPhotoAccess = await prisma.privatePhotoAccess.deleteMany({});
    console.log(`   ✅ ${deletedPhotoAccess.count} permisos de fotos eliminados`);

    const deletedMessages = await prisma.message.deleteMany({});
    console.log(`   ✅ ${deletedMessages.count} mensajes eliminados`);

    const deletedFavorites = await prisma.favorite.deleteMany({});
    console.log(`   ✅ ${deletedFavorites.count} favoritos eliminados`);

    const deletedLikes = await prisma.like.deleteMany({});
    console.log(`   ✅ ${deletedLikes.count} likes eliminados`);

    // 3. Eliminar fotos
    const deletedPhotos = await prisma.photo.deleteMany({});
    console.log(`   ✅ ${deletedPhotos.count} fotos eliminadas`);

    // 4. Eliminar sesiones de roam
    const deletedRoamSessions = await prisma.roamSession.deleteMany({});
    console.log(`   ✅ ${deletedRoamSessions.count} sesiones de roam eliminadas`);

    const deletedRoamPurchases = await prisma.roamPurchase.deleteMany({});
    console.log(`   ✅ ${deletedRoamPurchases.count} compras de roam eliminadas`);

    // 5. Eliminar suscripciones
    const deletedSubscriptions = await prisma.subscription.deleteMany({});
    console.log(`   ✅ ${deletedSubscriptions.count} suscripciones eliminadas`);

    // 6. Eliminar perfiles
    const deletedProfiles = await prisma.profile.deleteMany({});
    console.log(`   ✅ ${deletedProfiles.count} perfiles eliminados`);

    // 7. Eliminar usuarios (esto eliminará todo lo demás por CASCADE)
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`   ✅ ${deletedUsers.count} usuarios eliminados`);

    console.log('\n✅ ========================================');
    console.log('✅ BASE DE DATOS LIMPIADA EXITOSAMENTE');
    console.log('✅ ========================================\n');

    res.json({
      success: true,
      message: 'Base de datos limpiada exitosamente',
      deleted: {
        users: deletedUsers.count,
        profiles: deletedProfiles.count,
        photos: deletedPhotos.count,
        likes: deletedLikes.count,
        favorites: deletedFavorites.count,
        messages: deletedMessages.count,
        subscriptions: deletedSubscriptions.count,
        emailTokens: deletedEmailTokens.count,
        passwordTokens: deletedPasswordTokens.count,
        reports: deletedReports.count,
        blocks: deletedBlocks.count,
        photoAccess: deletedPhotoAccess.count,
        roamSessions: deletedRoamSessions.count,
        roamPurchases: deletedRoamPurchases.count
      }
    });

  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('❌ ERROR AL LIMPIAR BASE DE DATOS');
    console.error('❌ ========================================');
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error al limpiar base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
