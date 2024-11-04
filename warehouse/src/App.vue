<template>
  <div class="app-container">
    <main class="app-main">
      <router-view/>
    </main>
    <footer-view class="footer"/>
  </div>
</template>
<script setup>
import {RouterView} from 'vue-router'
import FooterView from "@/views/Footer/FooterView.vue";
</script>
<style scoped>
.app-container {
  display: grid;
  min-height: 100vh;
  grid: "main"
        "footer";
  overflow: hidden;
  grid-template-rows: 1fr auto;
  background: linear-gradient(
      160deg,
      rgb(140, 32, 41) 0%,
      black 50%,
      black 50%,
      rgb(45, 66, 120) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  transition: color 0.5s,
  background-color 0.5s;
}

.app-main {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.footer {
  grid-area: footer;
  display: grid;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: auto;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>