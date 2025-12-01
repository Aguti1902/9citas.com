import { Server } from 'socket.io';

// Variable global para almacenar la instancia de Socket.IO
let ioInstance: Server | null = null;

export const setIO = (io: Server) => {
  ioInstance = io;
};

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error('Socket.IO no está inicializado');
  }
  return ioInstance;
};

