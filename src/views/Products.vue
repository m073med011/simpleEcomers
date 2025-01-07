<template>
  <div class="products">
    <div class="mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="mb-0">Our Products</h1>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search products..." 
              v-model="searchQuery"
            >
            <button 
              class="btn btn-outline-secondary" 
              type="button"
              @click="resetFilters"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Filters</h5>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select v-model="selectedCategory" class="form-select">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Price Range</label>
              <div class="d-flex align-items-center gap-2">
                <span>$0</span>
                <input 
                  type="range" 
                  class="form-range" 
                  v-model="maxPrice" 
                  :max="maxAvailablePrice"
                  step="10"
                >
                <span>${{ maxPrice }}</span>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Sort By</label>
              <select v-model="sortBy" class="form-select">
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <button 
              class="btn btn-outline-secondary w-100"
              @click="resetFilters"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row">
          <div v-for="product in filteredProducts" :key="product.id" class="col-md-4 mb-4">
            <div class="card h-100 product-card">
              <div class="position-relative">
                <router-link :to="'/products/' + product.id">
                  <img :src="product.image" class="card-img-top" :alt="product.name">
                </router-link>
                <div class="product-rating">
                  <i class="bi bi-star-fill text-warning"></i>
                  {{ product.rating.toFixed(1) }}
                </div>
                <div v-if="product.stock < 5" class="product-stock-warning">
                  Only {{ product.stock }} left!
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <router-link 
                  :to="'/products/' + product.id" 
                  class="text-decoration-none text-dark"
                >
                  <h5 class="card-title text-truncate">{{ product.name }}</h5>
                </router-link>
                <p class="card-text flex-grow-1">{{ product.description.slice(0, 100) }}...</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <div>
                    <span class="h5 mb-0">${{ product.price.toFixed(2) }}</span>
                    <small class="text-muted d-block">{{ product.stock }} in stock</small>
                  </div>
                  <button 
                    @click="handleAddToCart(product)" 
                    class="btn btn-primary add-to-cart-btn"
                    :class="{ 'btn-adding': isAddingMap[product.id] }"
                    :disabled="product.stock === 0"
                  >
                    <i class="bi bi-cart-plus me-1"></i>
                    <span v-if="isAddingMap[product.id]">Added!</span>
                    <span v-else-if="product.stock === 0">Out of Stock</span>
                    <span v-else>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-5">
          <i class="bi bi-search display-1 text-muted"></i>
          <h3 class="mt-3">No products found</h3>
          <p class="text-muted">Try adjusting your search or filters</p>
          <button class="btn btn-primary" @click="resetFilters">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/product'
import { useNotificationStore } from '../stores/notification'
import { useProductFilters } from '../composables/useProductFilters'
import { useCartAnimations } from '../composables/useCartAnimations'
import type { Product } from '../stores/product'

const productStore = useProductStore()
const notificationStore = useNotificationStore()
const { products } = storeToRefs(productStore)
const { addToCart } = productStore

// Use composables
const {
  searchQuery,
  selectedCategory,
  maxPrice,
  sortBy,
  filteredProducts,
  categories,
  maxAvailablePrice,
  resetFilters
} = useProductFilters(products.value)

const {
  isAddingMap,
  cartBouncing,
  animateAddToCart
} = useCartAnimations()

const handleAddToCart = async (product: Product) => {
  if (product.stock === 0) {
    notificationStore.addNotification(
      'Sorry, this product is out of stock',
      'error'
    )
    return
  }

  await animateAddToCart(product)
  addToCart(product)
  notificationStore.addNotification(
    `${product.name} has been added to your cart`,
    'success'
  )
}
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.product-card:hover .card-img-top {
  opacity: 0.9;
}

.product-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.product-stock-warning {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.add-to-cart-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn:not(.btn-adding):not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-adding {
  background-color: #198754 !important;
  border-color: #198754 !important;
  animation: button-pop 0.3s ease;
}

@keyframes button-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.form-range::-webkit-slider-thumb {
  cursor: pointer;
}

.form-range::-webkit-slider-runnable-track {
  cursor: pointer;
}
</style>
