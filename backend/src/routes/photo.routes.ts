import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, requireProfile } from '../middleware/auth.middleware';
import * as photoController from '../controllers/photo.controller';

const router = Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  },
});

router.use(authenticateToken);
router.use(requireProfile);

// Subir foto
router.post('/upload', upload.single('photo'), photoController.uploadPhoto);

// Eliminar foto
router.delete('/:id', photoController.deletePhoto);

// Obtener fotos del perfil
router.get('/profile/:profileId', photoController.getProfilePhotos);

export default router;

