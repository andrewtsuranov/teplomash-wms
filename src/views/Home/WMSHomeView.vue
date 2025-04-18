<template>
  <div v-if="$route.name === 'Home'" class="home-view">
    <div class="welcome-text">
      <h3>
        Приветствуем Вас, {{ userStore.getFullNameUser?.firstName }}
        {{ userStore.getFullNameUser?.middleName }}!
      </h3>
      <p>
        Тепломаш® Warehouse Management System (WMS) — это информационная
        система, предназначенная для автоматизации управления складскими
        процессами и инфраструктурой склада в целом.
      </p>
      <ul>
        Система состоит из аппаратной и программной части:
        <li>
          Под аппаратной подразумеваются терминалы сбора данных (ТСД), серверы
          для хранения информации и другое оборудование, применение которого
          необходимо для автоматизированной работы складского комплекса.
        </li>
        <li>
          Программная часть — это IT-решения, которые позволяют организовать
          централизованное управление всеми складскими процессами и максимально
          эффективно использовать инфраструктуру склада.
        </li>
      </ul>
    </div>
    <div class="welcome-image" @click="router.push({ name: 'WMS' })">
      <span
        class="welcome-btn"
        style="font-size: 5rem; text-transform: uppercase"
      >
        Начать работу!
      </span>
    </div>
  </div>
  <RouterView />
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/HTTP/UserStore.js";
import { onMounted } from "vue";
import { useWebSocketStore } from "@/stores/WebSockets/WebSocketStore.js";
import { useErrorStore } from "@/stores/Error/ErrorStore.js";

const userStore = useUserStore();
const router = useRouter();
const errorStore = useErrorStore();
const webSocketStore = useWebSocketStore();
onMounted(async () => {
  try {
    await webSocketStore.initWebSocket();
  } catch (e) {
    console.log(e);
    errorStore.setError({
      status: e.response?.status || 500,
      message: "Ошибка соединения WebSocket",
    });
    throw e;
  }
});
</script>
<style scoped>
.home-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, 1fr);
  padding: 3rem;
  column-gap: 2rem;
  align-self: center;
}

.welcome-text {
  display: grid;
  row-gap: 1rem;
  grid-template-columns: minmax(auto, 1fr);
  grid-auto-rows: minmax(min-content, auto);
  background-color: rgba(245, 245, 245, 0.1);
  border-radius: 30px;
  padding: 1.5rem 0;
}

.welcome-text h3 {
  margin: 0;
  padding: 1rem;
  justify-self: center;
  color: #bc985f;
}

.welcome-text p {
  margin: 0;
  padding: 0 1.5rem;
  font-size: 1.2rem;
}

ul {
  padding: 0 1.5rem;
  font-size: 1.1rem;
}

ul li {
  padding-left: 1rem;
  font-size: 1.1rem;
  list-style: inside;
}

.welcome-image {
  display: grid;
  place-items: center;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 30px;
  padding: 1rem;
}

.welcome-btn {
  display: grid;
  text-align: center;
  color: blanchedalmond;
}

.welcome-image:before {
  content: "";
  background: linear-gradient(-45deg, #e71313, #e73c7e, #23a6d5, #0f32e2);
  /*backgrounds: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);*/
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(10px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  /*animation: gradient 10s ease infinite;*/
  animation: gradient 10s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 30px;
}

.welcome-image:hover {
  color: #bc985f;
}

.welcome-image:active:after {
  background: #2f2d2b;
  /*background: transparent;*/
}

.welcome-image:before {
  opacity: 1;
}

.welcome-image:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #111;
  left: 0;
  top: 0;
  border-radius: 30px;
}

@keyframes gradient {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (max-width: 1024px) {
  .home-view {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
    row-gap: 2rem;
  }

  .welcome-text {
    display: grid;
    row-gap: 1rem;
    align-items: center;
    grid-template-columns: minmax(auto, 1fr);
  }

  .welcome-text h3 {
    margin: 0;
    padding: 1rem;
    justify-self: center;
    color: #bc985f;
  }

  .welcome-text p {
    margin: 0;
    padding: 0 1.5rem;
    font-size: 1.2rem;
  }

  ul {
    padding: 0 1.5rem;
    font-size: 1.1rem;
  }

  ul li {
    padding-left: 1rem;
    font-size: 1.1rem;
    list-style: inside;
  }
}

@media (max-width: 1100px) {
  .welcome-image {
    grid-template-rows: 300px;
    margin: 1rem;
  }
}
</style>
