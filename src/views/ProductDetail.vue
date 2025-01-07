<template>
  <div class="product-detail" v-if="product">
    <div class="container py-4">
      <div class="row">
        <div class="col-md-6">
          <img :src="product.image" :alt="product.name" class="img-fluid rounded">
        </div>
        <div class="col-md-6">
          <h1 class="mb-3">{{ product.name }}</h1>
          <p class="lead mb-4">{{ product.description }}</p>
          <div class="d-flex align-items-center mb-4">
            <span class="h2 mb-0 me-3">${{ product.price.toFixed(2) }}</span>
            <span class="badge bg-success">{{ product.category }}</span>
          </div>
          <div class="d-flex align-items-center">
            <div class="input-group me-3" style="width: 130px;">
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="quantity > 1 && quantity--"
              >-</button>
              <input 
                type="number" 
                class="form-control text-center" 
                v-model="quantity"
                min="1"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="quantity++"
              >+</button>
            </div>
            <button 
              class="btn btn-primary"
              @click="addToCartWithQuantity"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container py-4">
    <div class="alert alert-warning">
      Product not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const quantity = ref(1)

const product = computed(() => {
  const productId = Number(route.params.id)
  return productStore.products.find(p => p.id === productId)
})

const addToCartWithQuantity = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      productStore.addToCart(product.value)
    }
    router.push('/cart')
  }
}
</script>

<style scoped>
.product-detail img {
  max-height: 500px;
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
</style>
