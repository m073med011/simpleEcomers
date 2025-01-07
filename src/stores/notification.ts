import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  const addNotification = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    timeout: number = 3000
  ) => {
    const id = Date.now()
    notifications.value.push({ id, message, type, timeout })

    if (timeout) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }
  }

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification
  }
})
