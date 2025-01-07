<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">Vue E-Commerce</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Products</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <router-link 
            to="/cart" 
            class="btn btn-outline-primary position-relative me-2 cart-button"
            :class="{ 'cart-bounce': cartBouncing }"
          >
            <i class="bi bi-cart3"></i>
            <span class="ms-2">Cart</span>
            <span 
              v-if="cartItemsCount > 0" 
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge"
            >
              {{ cartItemsCount }}
              <span class="visually-hidden">items in cart</span>
            </span>
          </router-link>
          <template v-if="isAuthenticated">
            <div class="dropdown">
              <button 
                class="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                id="userDropdown" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1"></i>
                Account
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-2"></i>Profile
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/orders">
                    <i class="bi bi-box me-2"></i>Orders
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button @click="handleLogout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-success me-2">Login</router-link>
            <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <NotificationToast />

  <div class="container py-4">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useProductStore } from './stores/product'
import NotificationToast from './components/NotificationToast.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()

const { isAuthenticated } = storeToRefs(authStore)
const { cartItemsCount } = storeToRefs(productStore)

const cartBouncing = ref(false)

// Watch for changes in cart count to trigger animation
watch(cartItemsCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    cartBouncing.value = true
    setTimeout(() => {
      cartBouncing.value = false
    }, 300)
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  authStore.initializeAuth()
  productStore.initializeStore()
})
</script>

<style>
.cart-button {
  transition: all 0.3s ease;
}

.cart-button:hover {
  transform: translateY(-2px);
}

.cart-badge {
  transition: all 0.3s ease;
  animation: badge-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes badge-pop {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  80% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.cart-bounce {
  animation: cart-bounce 0.3s ease;
}

@keyframes cart-bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Smooth transitions for route changes */
.router-link-active {
  font-weight: bold;
}

/* Dropdown hover effects */
.dropdown-item {
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  padding-left: 1.5rem;
}

/* General styles */
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}

/* Sticky footer */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.py-4 {
  flex: 1;
}
</style>
