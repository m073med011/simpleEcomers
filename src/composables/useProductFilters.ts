import { ref, computed } from 'vue'
import type { Product } from '../stores/product'

export function useProductFilters(products: Product[]) {
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const maxPrice = ref(2000)
  const sortBy = ref<'price-asc' | 'price-desc' | 'name' | 'rating'>('rating')

  const filteredProducts = computed(() => {
    return products
      .filter(product => {
        const categoryMatch = !selectedCategory.value || product.category === selectedCategory.value
        const priceMatch = product.price <= maxPrice.value
        const searchMatch = !searchQuery.value || 
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        return categoryMatch && priceMatch && searchMatch
      })
      .sort((a, b) => {
        switch (sortBy.value) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'name':
            return a.name.localeCompare(b.name)
          case 'rating':
            return b.rating - a.rating
          default:
            return 0
        }
      })
  })

  const categories = computed(() => {
    return [...new Set(products.map(product => product.category))]
  })

  const maxAvailablePrice = computed(() => {
    return Math.max(...products.map(product => product.price))
  })

  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
    maxPrice.value = maxAvailablePrice.value
    sortBy.value = 'rating'
  }

  return {
    searchQuery,
    selectedCategory,
    maxPrice,
    sortBy,
    filteredProducts,
    categories,
    maxAvailablePrice,
    resetFilters
  }
}
