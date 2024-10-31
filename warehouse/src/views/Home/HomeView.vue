<template>
  <div class="home-view-container">
    <router-link :to="{name: 'WMS'}">
      <div class="wms-input" @click="router.push({name: 'wmsIN'})">
        Добро пожаловать в систему управления складом
      </div>
    </router-link>
  </div>
</template>
<script setup>
</script>
<style scoped>
.home-view-container {
  display: grid;
  background-color: rgba(245, 245, 245, 0.05);
  margin: 0 60px;
  height: 100%;
  place-content: center;
}

@media (max-width: 1024px) {
  .home-view-container {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;
  }
}
</style>