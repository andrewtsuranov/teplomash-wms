<template>
  <div class="grid-container">
    <header class="grid-item header">
      <logo-general class="logo-general"/>
    </header>
    <nav class="grid-item left-column">
      <greetings-page msg="Добро пожаловать!"/>
      <RouterLink to="/">Вход</RouterLink>
      <RouterLink to="/listUsers">Список пользователей</RouterLink>
    </nav>
    <main class="grid-item right-column">
      <RouterView/>
    </main>
  </div>
</template>
<script setup>
import {RouterLink, RouterView} from 'vue-router'
import GreetingsPage from "@/components/GreetingsPage.vue";
import LogoGeneral from "@/components/UI/LogoGeneral.vue"
</script>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  row-gap: 5rem;
}

.grid-item {
  padding: 1rem;
}

.header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-general {
  height: 100px;
}

.left-column {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.right-column {
  overflow-y: auto;
}

nav {
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover,
nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .left-column {
    grid-row: 2;
  }

  .right-column {
    grid-row: 3;
  }

  nav {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>