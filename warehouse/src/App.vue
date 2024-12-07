<template>
  <div class="app-container">
    <main class="app-main">
      <router-view/>
    </main>
    <footer>
      <footer-view/>
    </footer>
  </div>
</template>
<script setup>
import {RouterView} from 'vue-router'
import FooterView from "@/views/Footer/FooterView.vue";
import {onMounted, onUnmounted} from "vue";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";

const webSocketStore = useWebSocketStore()

onMounted(() => {
  webSocketStore.initWebSocket()
})
</script>
<style>
.router-link,
.router-link:link,
.router-link:visited,
.router-link:hover,
.router-link:active {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  font: inherit;
}

.app-container {
  display: grid;
  min-height: 100vh;
  grid: "main"
        "footer";
  overflow: hidden;
  /*grid-template-columns: minmax(auto, 1440px);*/
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
}

footer {
  display: grid;
  grid-area: footer;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: auto;
  grid-template-columns: minmax(auto, 1440px);
  justify-content: center;
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