import { ref } from 'vue'
import type { Product } from '../stores/product'

export function useCartAnimations() {
  const isAddingMap = ref<{ [key: number]: boolean }>({})
  const cartBouncing = ref(false)

  const animateAddToCart = async (product: Product) => {
    isAddingMap.value[product.id] = true
    cartBouncing.value = true

    // Reset the button state after animation
    setTimeout(() => {
      isAddingMap.value[product.id] = false
    }, 1000)

    // Reset cart bounce animation
    setTimeout(() => {
      cartBouncing.value = false
    }, 300)
  }

  return {
    isAddingMap,
    cartBouncing,
    animateAddToCart
  }
}
