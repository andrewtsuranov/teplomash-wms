<template>
  <div class="header-search-container">
    <BFormInput class="me-2" placeholder="Поиск Тепломаш..." />
    <my-button>Найти</my-button>
<!--    <BButton type="submit" variant="outline-success">Search</BButton>-->
  </div>
</template>
<script setup>
import MyButton from "@/components/UI/MyButton.vue";
</script>
<style scoped>
.header-search-container {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
}
@media (max-width: 1024px) {
  .header-search-container {

    grid-template-columns: 1fr auto;

  }
}
</style>