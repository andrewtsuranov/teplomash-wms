<template>
  <div class="home-view">
    <div class="welcome-text">
      <h3>
        Приветствуем Вас, {{ userStore.getFullNameUser.firstName }} {{ userStore.getFullNameUser.middlename }}!
      </h3>
      <p>Тепломаш&reg; Warehouse Management System (WMS) — это информационная система, предназначенная для
        автоматизации
        управления складскими процессами и инфраструктурой склада в целом.
      </p>
      <ul> Система состоит из аппаратной и
        программной части:
        <li>
          Под аппаратной подразумеваются терминалы сбора данных (ТСД), серверы для хранения информации и
          другое оборудование, применение которого необходимо для автоматизированной работы складского комплекса.
        </li>
        <li>
          Программная часть — это IT-решения, которые позволяют организовать централизованное управление всеми
          складскими процессами и максимально эффективно использовать инфраструктуру склада.
        </li>
      </ul>
    </div>
    <div class="welcome-image"
         @click="router.push({name: 'WMS'})"
    >
      <span style="font-size: 5rem; text-transform: uppercase" class="welcome-btn"
      >Начать работу!
      </span>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";

const userStore = useUserStore()
const router = useRouter()
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
}

.glow-on-hover:before {
  content: '';
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
  position: absolute;
  top: -.5px;
  left: -.5px;
  background-size: 400%;
  z-index: -1;
  filter: blur(3px);
  width: calc(100% + 1px);
  height: calc(100% + 1px);
  animation: glowing 20s linear infinite;
  opacity: 0;
  transition: opacity .3s ease-in-out;
  border-radius: 10px;
}

.welcome-image:before {
  content: '';
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 800%;
  z-index: -1;
  filter: blur(10px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing 60s linear infinite;
  opacity: 0;
  transition: opacity .3s ease-in-out;
  border-radius: 30px;
}

.glow-on-hover:active {
  color: #000
}

.glow-on-hover:active:after {
  background: transparent;
}

.glow-on-hover:before {
  opacity: 1;
}

.glow-on-hover:after {
  z-index: -1;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #111;
  left: 0;
  top: 0;
  border-radius: 10px;
}

.welcome-image:hover {
  color: #bc985f;
}

.welcome-image:active:after {
  background: #2F2D2B;
  /*background: transparent;*/
}

.welcome-image:before {
  opacity: 1;
}

.welcome-image:after {
  z-index: -1;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #111;
  left: 0;
  top: 0;
  border-radius: 30px;
}

@keyframes glowing {
  0% {
    background-position: 100% 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@media (max-width: 1024px) {
  .home-view-container {
    display: grid;
    margin: 1.5rem;
  }

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