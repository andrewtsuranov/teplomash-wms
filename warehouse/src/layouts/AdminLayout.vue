<template>
  <div class="app-container">
    <nav class="navbar" ref="navbar">
      <div class="navbar-content">
        <!-- SVG логотип -->
        <div class="logo-container">
          <svg-logo/>
        </div>
        <!-- Навигационные элементы -->
        <div class="nav-items">
          <a href="#" v-for="item in navItems" :key="item" class="nav-item">
            {{ item }}
          </a>
        </div>
        <!-- Мобильное меню -->
        <button class="mobile-menu-btn md:hidden">
          <span class="sr-only">Меню</span>
          <div class="hamburger">≡</div>
        </button>
      </div>
    </nav>
    <!-- Основной контент -->
    <main class="main-content" :style="{ marginTop: navbarHeight + 'px' }">
              <my-button :disabled="!webSocketStore.isConnected"
                         @click="webSocketStore.createWarehouse"
              >Создать склад
              </my-button>
              <my-button :disabled="!webSocketStore.isConnected"
                         @click="webSocketStore.getWarehouse"
              >Получить склад
              </my-button>
              <my-button :disabled="!webSocketStore.isConnected"
                         @click="webSocketStore.createPallet"
              >Создать паллету
              </my-button>
      <div class="grid-container">
        <div v-for="n in 12" :key="n" class="grid-item">
          Контент {{ n }}
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import SvgLogo from "@/components/UI/SVG/svgLogo.vue";

const navbar = ref(null)
const navbarHeight = ref(0)
const navItems = ['Главная', 'О нас', 'Услуги', 'Контакты']
const updateNavbarHeight = () => {
  if (navbar.value) {
    navbarHeight.value = navbar.value.offsetHeight
  }
}
onMounted(() => {
  updateNavbarHeight()
  window.addEventListener('resize', updateNavbarHeight)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight)
})
</script>
<style scoped>
.app-container {
  min-height: 100vh;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "logo nav menu";
  gap: 2rem;
  align-items: center;
}

.logo-container {
  grid-area: logo;
  width: 120px;
  height: 40px;
  justify-self: start;
}

.logo {
  width: 100%;
  height: 100%;
  color: #4CAF50;
}

.nav-items {
  grid-area: nav;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 2rem;
  justify-content: end;
}

.nav-item {
  color: #4CAF50;
  text-decoration: none;
  padding: 0.5rem;
}

.mobile-menu-btn {
  grid-area: menu;
  justify-self: end;
  padding: 0.5rem;
  display: none;
}

.hamburger {
  font-size: 2rem;
  line-height: 1;
  color: #4CAF50;
}

.main-content {
  padding: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
}

.grid-item {
  background-color: #4CAF50;
  padding: 1rem;
  border-radius: 0.5rem;
  min-height: 200px;
}

/* Медиа-запросы */
@media (max-width: 768px) {
  .navbar-content {
    grid-template-columns: auto auto;
    grid-template-areas:
      "logo menu"
      "nav nav";
  }

  .nav-items {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  /* Добавьте класс для открытого меню */
  .nav-items.open {
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
  }
}

/* Для больших экранов */
@media (min-width: 1024px) {
  .navbar-content {
    padding: 1.5rem;
  }

  .logo-container {
    width: 150px;
    height: 50px;
  }
}

/* Для очень больших экранов */
@media (min-width: 1536px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
</style>