import { create } from 'zustand'

interface NotificationStore {
  likesCount: number
  unreadMessagesCount: number
  setLikesCount: (count: number) => void
  incrementLikesCount: () => void
  decrementLikesCount: () => void
  setUnreadMessagesCount: (count: number) => void
  incrementUnreadMessagesCount: () => void
  decrementUnreadMessagesCount: () => void
  reset: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  likesCount: 0,
  unreadMessagesCount: 0,
  setLikesCount: (count) => set({ likesCount: count }),
  incrementLikesCount: () => set((state) => ({ likesCount: state.likesCount + 1 })),
  decrementLikesCount: () => set((state) => ({ likesCount: Math.max(0, state.likesCount - 1) })),
  setUnreadMessagesCount: (count) => set({ unreadMessagesCount: count }),
  incrementUnreadMessagesCount: () => set((state) => ({ unreadMessagesCount: state.unreadMessagesCount + 1 })),
  decrementUnreadMessagesCount: () => set((state) => ({ unreadMessagesCount: Math.max(0, state.unreadMessagesCount - 1) })),
  reset: () => set({ likesCount: 0, unreadMessagesCount: 0 }),
}))

