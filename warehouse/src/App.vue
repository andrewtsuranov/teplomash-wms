<template>
  <div class="app-container">
    <main class="app-main">
      <RouterView/>
    </main>
    <footer-main-view class="footer"/>
  </div>
</template>
<script setup>
import {RouterView} from 'vue-router'
import FooterMainView from "@/views/FooterMainView.vue";
</script>
<style scoped>
.app-container {
  display: grid;
  min-height: 100vh;
  grid: "main"
        "footer";
  overflow: hidden;
  grid-template-rows: 1fr auto;
}

.app-main {
  grid-area: main;
  display: grid;
}

.footer {
  grid-area: footer;
  display: grid;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: auto;
}
</style>