<template>
  <div class="cart">
    <h1 class="mb-4">Shopping Cart</h1>

    <div v-if="cart.length === 0" class="text-center py-5">
      <i class="bi bi-cart-x display-1 text-muted"></i>
      <h3 class="mt-3">Your cart is empty</h3>
      <p class="text-muted">Add some products to your cart and they will show up here</p>
      <router-link to="/products" class="btn btn-primary btn-lg mt-3">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <div v-for="item in cart" :key="item.product.id" class="cart-item mb-3">
              <div class="row align-items-center">
                <div class="col-md-2">
                  <img :src="item.product.image" :alt="item.product.name" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                  <h5 class="mb-1">{{ item.product.name }}</h5>
                  <p class="text-muted mb-0">${{ item.product.price.toFixed(2) }}</p>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="handleDecrement(item.product.id)"
                      :disabled="item.quantity <= 1"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <input 
                      type="number" 
                      class="form-control text-center" 
                      :value="item.quantity"
                      @change="e => handleQuantityChange(item.product.id, parseInt(e.target.value))"
                      min="1"
                      :max="item.product.stock"
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="handleIncrement(item.product.id)"
                      :disabled="item.quantity >= item.product.stock"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <small class="text-muted d-block text-center mt-1">
                    {{ item.product.stock }} available
                  </small>
                </div>
                <div class="col-md-2 text-end">
                  <span class="h5">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="col-md-1 text-end">
                  <button 
                    @click="handleRemoveFromCart(item.product.id)" 
                    class="btn btn-link text-danger"
                    title="Remove item"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Order Summary</h5>
            <div class="d-flex justify-content-between mb-3">
              <span>Subtotal</span>
              <span class="h5">${{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span>Items</span>
              <span>{{ cartItemsCount }}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-4">
              <span class="h5">Total</span>
              <span class="h4">${{ cartTotal.toFixed(2) }}</span>
            </div>
            <button 
              class="btn btn-primary w-100" 
              @click="handleCheckout"
              :disabled="cartItemsCount === 0"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/product'
import { useNotificationStore } from '../stores/notification'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const productStore = useProductStore()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const { cart, cartTotal, cartItemsCount } = storeToRefs(productStore)

const handleRemoveFromCart = (productId: number) => {
  productStore.removeFromCart(productId)
  notificationStore.addNotification('Item removed from cart', 'success')
}

const handleIncrement = (productId: number) => {
  const item = cart.value.find(item => item.product.id === productId)
  if (!item) return

  if (item.quantity >= item.product.stock) {
    notificationStore.addNotification('Maximum stock limit reached', 'warning')
    return
  }

  item.quantity++
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const handleDecrement = (productId: number) => {
  const item = cart.value.find(item => item.product.id === productId)
  if (!item) return

  if (item.quantity <= 1) {
    notificationStore.addNotification('Minimum quantity is 1', 'warning')
    return
  }

  item.quantity--
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const handleQuantityChange = (productId: number, value: number) => {
  const item = cart.value.find(item => item.product.id === productId)
  if (!item) return

  let newQuantity = value
  if (newQuantity < 1) {
    newQuantity = 1
    notificationStore.addNotification('Minimum quantity is 1', 'warning')
  } else if (newQuantity > item.product.stock) {
    newQuantity = item.product.stock
    notificationStore.addNotification(`Maximum stock available is ${item.product.stock}`, 'warning')
  }

  item.quantity = newQuantity
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const handleCheckout = () => {
  if (!authStore.isAuthenticated) {
    notificationStore.addNotification('Please login to checkout', 'warning')
    router.push('/login')
    return
  }
  
  notificationStore.addNotification('Order placed successfully!', 'success')
  cart.value = []
  localStorage.setItem('cart', JSON.stringify([]))
}
</script>

<style scoped>
.cart-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cart-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.cart-item img {
  max-height: 80px;
  width: 100%;
  object-fit: cover;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-link {
  padding: 0;
  font-size: 1.2rem;
}

.btn-link:hover {
  color: #dc3545 !important;
  opacity: 0.8;
}
</style>
