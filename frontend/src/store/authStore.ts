import { create } from 'zustand'
import { api } from '../services/api'

interface User {
  id: string
  email: string
  hasProfile: boolean
  profile?: any
  subscription?: any
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  hasProfile: boolean
  isLoading: boolean
  
  // Acciones
  setUser: (user: User | null) => void
  setToken: (accessToken: string, refreshToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, orientation: string, captchaToken?: string) => Promise<{ requiresVerification: boolean, email: string, orientation: string }>
  logout: () => Promise<void>
  initAuth: () => Promise<void>
  refreshUserData: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: false,
  hasProfile: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      hasProfile: user?.hasProfile || false,
    })
  },

  setToken: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ accessToken })
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ accessToken })
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, accessToken, refreshToken } = response.data

      get().setTokens(accessToken, refreshToken)
      get().setUser(user)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión')
    }
  },

  register: async (email, password, orientation, captchaToken) => {
    try {
      const response = await api.post('/auth/register', { email, password, orientation, captchaToken })
      
      // Verificar si requiere verificación de email
      if (response.data.requiresVerification) {
        return {
          requiresVerification: true,
          email: response.data.email,
          orientation: response.data.orientation,
        }
      }

      // Si no requiere verificación (modo legacy), continuar como antes
      const { user, accessToken, refreshToken, orientation: savedOrientation } = response.data
      get().setTokens(accessToken, refreshToken)
      get().setUser(user)

      return { 
        requiresVerification: false,
        email: response.data.email,
        orientation: savedOrientation 
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al registrarse')
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        hasProfile: false,
      })
    }
  },

  initAuth: async () => {
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      set({ isLoading: false })
      return
    }

    try {
      const response = await api.get('/auth/me')
      get().setUser(response.data)
    } catch (error) {
      // Token inválido, limpiar
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        hasProfile: false,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  refreshUserData: async () => {
    try {
      const response = await api.get('/auth/me')
      get().setUser(response.data)
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error)
    }
  },
}))

