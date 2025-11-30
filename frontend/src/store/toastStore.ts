import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }))
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },
}))

// Helper function to replace alert()
export const showToast = (message: string, type?: 'success' | 'error' | 'warning' | 'info') => {
  useToastStore.getState().addToast(message, type)
}

