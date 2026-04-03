<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Contact</span>
      </div>
      <span class="pill">Trust Center</span>
      <h1 class="content-title">Contact PutPulse</h1>
      <p class="content-intro">Email:</p>
      <div class="content-actions">
        <a class="btn btn-primary" href="mailto:admin@putpulse.com">admin@putpulse.com</a>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['navigate-route']);

const navigateRoute = (event, path) => {
  emit('navigate-route', event, path);
};
</script>
