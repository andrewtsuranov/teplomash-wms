<template>
  <div class="home-layout-container">
    <header class="home-layout-header">
      <header-view/>
    </header>
    <!--    <div v-if="userStore.loading">Loading...</div>-->
    <main class="home-layout-main">
      <RouterView/>
    </main>
  </div>
</template>
<script setup>
import HeaderView from "@/views/HeaderView.vue";
// import {useUserStore} from "@/stores/UserStore.js";
// const userStore = useUserStore()
</script>
<style scoped>
.home-layout-container {
  display: grid;
  grid: "homeHeader"
        "homeMain";
  grid-template-rows: auto 1fr;
}

.home-layout-header {
  grid-area: homeHeader;
  background-color: rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: 1fr;
}

.home-layout-main {
  grid-area: homeMain;
}
</style>