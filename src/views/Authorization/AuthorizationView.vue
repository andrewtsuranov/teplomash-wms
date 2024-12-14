<template>
  <div class="authorization-container">
    <logo-main class="logo-main"/>
    <div class="greetings">
      <span style="font-size: 2.5rem; text-align: center">Добро пожаловать!</span>
      <span style="font-size: 1.5rem">Система управления складом Тепломаш&reg; с адресным хранением </span>
      <span style="font-size: 1.1rem; text-align: start">Разработана для сотрудников складских помещений Тепломаш&reg; с целью оптимизации процессов поиска, комплектации
        и хранения товарной номенклатуры.</span>
    </div>
    <router-view class="authorization"></router-view>
  </div>
</template>
<script setup>
import LogoMain from "@/components/UI/SVG/svgLogo.vue"
</script>
<style scoped>
.authorization-container {
  display: grid;
  grid-template-areas:
        "logo logo"
        "greetings authorization";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, max-content) 1fr;
  gap: 6rem;
  align-self: center;
  padding: 5rem;
}

.logo-main {
  grid-area: logo;
  display: grid;
  grid-template-columns: minmax(auto, 600px);
  place-self: center;
  padding: 20px;
}

.greetings {
  grid-area: greetings;
  display: grid;
  align-content: start;
  justify-content: center;
  row-gap: 20px;
  padding: 0 1rem;
}

.authorization {
  grid-area: authorization;
  padding: 0 1rem;
}

@media (max-width: 800px) {
  .authorization-container {
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    grid-template-areas:
      "logo"
      "greetings"
      "authorization";
    gap: 2rem;
    padding: 1rem;
  }
}
</style>