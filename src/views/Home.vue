<template>
  <div class="home">
    <div class="jumbotron text-center bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">Welcome to Vue E-Commerce</h1>
      <p class="lead">Discover our amazing products at great prices!</p>
      <router-link to="/products" class="btn btn-primary btn-lg">
        Shop Now
      </router-link>
    </div>

    <h2 class="mb-4">Featured Products</h2>
    <div class="row">
      <div v-for="product in featuredProducts" :key="product.id" class="col-md-4 mb-4">
        <div class="card h-100 product-card">
          <div class="position-relative">
            <img :src="product.image" class="card-img-top" :alt="product.name">
            <div class="product-rating">
              <i class="bi bi-star-fill text-warning"></i>
              {{ product.rating.toFixed(1) }}
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text flex-grow-1">{{ product.description }}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '../stores/product'
import { useNotificationStore } from '../stores/notification'
import { useCartAnimations } from '../composables/useCartAnimations'
import type { Product } from '../stores/product'

const productStore = useProductStore()
const notificationStore = useNotificationStore()

const featuredProducts = computed(() => {
  return productStore.products
    .filter(product => product.rating >= 4.7)
    .slice(0, 3)
})

const { addToCart } = productStore
const { isAddingMap, animateAddToCart } = useCartAnimations()

const handleAddToCart = async (product: Product) => {
  if (product.stock === 0) {
    notificationStore.addNotification(
      'Sorry, this product is out of stock',
      'error'
    )
    return
  }

  try {
    await animateAddToCart(product)
    addToCart(product)
    notificationStore.addNotification(
      `${product.name} has been added to your cart`,
      'success'
    )
  } catch (error) {
    notificationStore.addNotification(
      error instanceof Error ? error.message : 'Failed to add product to cart',
      'error'
    )
  }
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
</style>
