import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket
  }

  // Si no hay token, no intentar conectar
  if (!token) {
    console.warn('⚠️ No hay token para conectar Socket.IO')
    return null
  }

  try {
    // Obtener la URL del backend desde la variable de entorno o inferirla desde API_URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const socketUrl = import.meta.env.VITE_SOCKET_URL || apiUrl.replace('/api', '')

    socket = io(socketUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log('✅ Conectado a Socket.IO')
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado de Socket.IO:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Error de conexión Socket.IO:', error.message)
      // No lanzar error, solo loguear
    })

    socket.on('error', (error) => {
      console.error('Error de Socket.IO:', error)
    })

    return socket
  } catch (error) {
    console.error('Error al inicializar Socket.IO:', error)
    return null
  }
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

