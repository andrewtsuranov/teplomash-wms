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
  display: grid;
  grid-area: main;
  justify-content: center;
}

.footer {
  grid-area: footer;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: auto;
  align-content: center;
}
</style>