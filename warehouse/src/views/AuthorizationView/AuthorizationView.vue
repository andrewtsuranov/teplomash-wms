<template>
  <div class="authorization-container">
    <logo-main class="logo-main" :height="valuePX"/>
    <div class="greetings">
      <span style="font-size: 2.5rem">Добро пожаловать!</span>
      <span style="font-size: 1.5rem">Адресная система хранения складом Тепломаш&reg;</span>
      <span style="font-size: 1.1rem; text-align: start">Разработана для сотрудников складских помещений Тепломаш&reg; с целью оптимизации процессов поиска, комплектации
        и хранения товарной номенклатуры.</span>
    </div>
    <RouterView class="authorization"/>
  </div>
</template>
<script setup>
import {RouterView} from 'vue-router'
import LogoMain from "@/components/UI/LogoTeplomash.vue"
import {ref} from "vue";

const valuePX = ref('150px')
</script>
<style scoped>
.authorization-container {
  display: grid;
  grid-template-areas:
        "logo logo"
        "greetings authorization";
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  padding: 20px;
}

.logo {

}

.logo-main {
  grid-area: logo;
  place-self: center;
  padding: 20px;
  /*height: 115px;*/
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

h1 {
  /*font-weight: 500;*/
  /*font-size: 2.6rem;*/
  /*position: relative;*/
  /*top: -10px;*/
}

p {
  /*margin-bottom: 1rem;*/
}

p, span {
  /*font-size: 1.3rem;*/
}

.greetings h1,
.greetings span,
.greetings p {
  /*text-align: left;*/
  /*color: blanchedalmond;*/
}

@media (max-width: 1024px) {
  .authorization-container {
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    /*grid-template-columns: 520px;*/

    grid-template-areas:
      "logo"
      "greetings"
      "authorization";
    gap: 2rem;
  }
  .greetings span {
    text-align: center;
  }
  .logo-main {

    padding: 0 20px;
    /*height: 115px;*/
  }
  /*.greetings h1,*/
  /*.greetings span,*/
  /*.greetings p {*/
  /*  text-align: center;*/
  /*}*/
}
</style>