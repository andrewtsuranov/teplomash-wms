<template>
  <div class="home-page-container">
    <header class="home-page-header">
      <header-view/>
    </header>
    <main class="home-page-main">
      <RouterView/>
    </main>
  </div>
</template>
<script setup>
import HeaderView from "@/views/HeaderView.vue";
</script>
<style scoped>
.home-page-container {
  display: grid;
  grid: "homeHeader"
        "homeMain";
  overflow: hidden;
  grid-template-rows: auto 1fr;
}

.home-page-header {
  grid-area: homeHeader;
  background-color: rgba(0, 0, 0, 0.3);
  margin-bottom: 50px;
}

.home-page-main {
  grid-area: homeMain;
}
</style>