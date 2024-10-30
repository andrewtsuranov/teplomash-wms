<template>
  <div class="home-view-container">
    <wms-home-view/>
  </div>
</template>
<script setup>
import WmsHomeView from "@/views/HomeView/WMSView/WmsHomeView.vue";
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