import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import photoRoutes from './routes/photo.routes';
import likeRoutes from './routes/like.routes';
import favoriteRoutes from './routes/favorite.routes';
import messageRoutes from './routes/message.routes';
import blockRoutes from './routes/block.routes';
import subscriptionRoutes from './routes/subscription.routes';
import roamRoutes from './routes/roam.routes';
import adminRoutes from './routes/admin.routes';
import privatePhotoRoutes from './routes/privatePhoto.routes';

// Importar servicios
import { setupSocketHandlers } from './services/socket.service';
import { setIO } from './services/socket.io';

const app = express();
const httpServer = createServer(app);

// Configurar Socket.IO
// Obtener URLs del frontend desde variables de entorno o usar defaults
const frontendUrls = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [
      'http://localhost:3000',
      'https://9citas-com-fyij.vercel.app',
      'https://9citas-com-hev9.vercel.app',
    ];

const io = new Server(httpServer, {
  cors: {
    origin: frontendUrls,
    credentials: true,
  },
});

// Configurar instancia global de Socket.IO
setIO(io);

// Middleware CORS - Configuración simplificada y permisiva
// Permitir todos los orígenes de Vercel y localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://9citas-com-fyij.vercel.app',
  'https://9citas-com-hev9.vercel.app',
  // Añadir cualquier origen de Vercel
  /^https:\/\/.*\.vercel\.app$/,
];

// Si hay variable de entorno, añadir esos orígenes también
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim()).filter(Boolean);
  allowedOrigins.push(...envOrigins);
  console.log('🌐 Orígenes CORS desde ENV:', envOrigins);
}

console.log('🌐 Configuración CORS activa');

// Configuración de CORS permisiva
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar si el origen está permitido
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      console.log(`✅ CORS permitido para: ${origin}`);
      callback(null, true);
    } else {
      // En producción, permitir temporalmente cualquier origen de Vercel
      if (process.env.NODE_ENV === 'production' && origin.includes('vercel.app')) {
        console.log(`⚠️  Permitiendo origen de Vercel temporalmente: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS bloqueado para: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// Manejar preflight OPTIONS requests explícitamente
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  console.log(`✅ OPTIONS request respondida para: ${origin || 'sin origin'}`);
  res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Servir fotos de perfiles falsos (desarrollo y producción)
const fakePhotosPath = path.join(__dirname, '../fake-profiles-photos');
if (fs.existsSync(fakePhotosPath)) {
  app.use('/fake-photos', express.static(fakePhotosPath));
  console.log('✅ Servidor de fotos falsas activado en /fake-photos');
} else {
  console.warn('⚠️  Carpeta fake-profiles-photos no encontrada');
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/roam', roamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/private-photos', privatePhotoRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '9citas API is running' });
});

// Socket.IO handlers
setupSocketHandlers(io);

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 WebSocket disponible en ws://localhost:${PORT}`);
});

// Exportar io para usarlo en otros módulos si es necesario
export { io };

