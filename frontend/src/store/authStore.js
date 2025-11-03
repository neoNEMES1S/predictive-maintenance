import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth } from '../services/supabaseClient'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      
      logout: async () => {
        // Sign out from Supabase
        await auth.signOut()
        // Clear local storage
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        // Update state
        set({ token: null, user: null, isAuthenticated: false })
      },
      
      // Check if user is authenticated based on stored token
      checkAuth: () => {
        const { token, user } = get()
        if (token && user) {
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        // When the state is rehydrated from storage, update isAuthenticated
        if (state?.token && state?.user) {
          state.isAuthenticated = true
        }
      },
    }
  )
)

export default useAuthStore

