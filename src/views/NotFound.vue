<template>
  <div class="not-found">
    <div class="text-center py-5">
      <div class="display-1 text-muted mb-4">
        <i class="bi bi-emoji-frown"></i>
      </div>
      <h1 class="display-4">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead text-muted mb-4">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg">
        <i class="bi bi-house-door me-2"></i>
        Return Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.display-1 {
  font-size: 5rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.btn-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
