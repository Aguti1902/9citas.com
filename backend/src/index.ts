import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

const app = express();
const httpServer = createServer(app);

// Configurar Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

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

