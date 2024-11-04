<template>
  <div class="home-layout-container">
    <header class="home-layout-header">
      <header-view/>
    </header>
    <div v-if="userStore.loading">Loading...</div>
    <div v-else></div>
    <main class="home-layout-main">
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
import HeaderView from "@/views/Header/NavbarView.vue";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";

const userStore = useUserStore()
</script>
<style scoped>
.home-layout-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(60px, auto) 1fr;
}

.home-layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #311617;
  width: 100%;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.8);
}

.home-layout-main {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  padding: 2rem 0;
}
</style>