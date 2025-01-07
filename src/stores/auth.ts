import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Initialize from localStorage
  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  const login = (email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo, we'll simulate a successful login
    const mockUser = {
      id: 1,
      email,
      name: email.split('@')[0]
    }
    user.value = mockUser
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  const register = (email: string, password: string, name: string) => {
    // In a real app, this would make an API call
    // For demo, we'll simulate a successful registration
    const mockUser = {
      id: Date.now(),
      email,
      name
    }
    user.value = mockUser
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  return {
    user,
    isAuthenticated,
    initializeAuth,
    login,
    logout,
    register
  }
})
