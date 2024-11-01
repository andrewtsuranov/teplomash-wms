<template>
  <div class="home-layout-container">
    <header class="home-layout-header">
      <header-view/>
    </header>
    <div v-if="userStore.loading">Loading...</div>
    <main class="home-layout-main">
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
import HeaderView from "@/views/Header/HeaderView.vue";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";

const userStore = useUserStore()
</script>
<style scoped>
.home-layout-container {
  display: grid;
  grid: "homeHeader"
        "homeMain";
  grid-template-rows: 60px 1fr;
}

.home-layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  grid-area: homeHeader;
  display: grid;
  background: #311617;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  grid-template-columns: 1fr;
}

.home-layout-main {
  grid-area: homeMain;
}
</style>