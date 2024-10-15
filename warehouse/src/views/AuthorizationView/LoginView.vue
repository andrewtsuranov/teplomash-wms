<template>
  <main class="main">
    <logo-main class="logo logo-main"/>
    <div class="greetings">
      <h1 class="">Добро пожаловать!</h1>
      <p>Адресная система хранения складом Тепломаш&reg;</p>
      <span>Разработана для сотрудников складских помещений Тепломаш&reg; с целью оптимизации процессов поиска, комплектации
        и хранения товарной номенклатуры</span>
    </div>
    <RouterView class="authorization"/>
  </main>
</template>
<script setup>
import {RouterView} from 'vue-router'
import LogoMain from "@/components/UI/LogoMain.vue";
</script>
<style scoped>
.main {
  display: grid;
  overflow: hidden;
  grid-template-columns: 1fr 1fr;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px 0 20px;
  justify-items: center;
  gap: 5rem;
  align-content: center;
}

.logo {
  grid-column: 1 / -1;
}

.logo-main {
  height: 115px;
}

.greetings {
  padding: 0 1rem;
}

.authorization {
  padding: 0 1rem;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

p {
  margin-bottom: 1rem;
}

p, span {
  font-size: 1.3rem;
}

.greetings h1,
.greetings span,
.greetings p {
  text-align: center;
  color: blanchedalmond;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings span,
  .greetings p {
    text-align: left;
    color: blanchedalmond;
  }
}
</style>