import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('✅ Conectado a Socket.IO')
  })

  socket.on('disconnect', () => {
    console.log('❌ Desconectado de Socket.IO')
  })

  socket.on('error', (error) => {
    console.error('Error de Socket.IO:', error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = (): Socket | null => {
  return socket
}

