<template>
  <form
    class="search-container"
    data-bs-theme="dark"
    role="search"
    @submit.prevent="handleTotalSearchByTeplomash"
  >
    <input
      aria-label="Search"
      class="form-control me-2"
      placeholder="Поиск Тепломаш..."
      type="search"
      v-model="totalSearchQueries"
    />
    <button class="btn btn-outline-primary" type="submit">Поиск</button>
  </form>
</template>
<script setup>
import { ref } from "vue";

const totalSearchQueries = ref("");
const handleTotalSearchByTeplomash = () => {
  console.log(`Ваш глобальный запрос по Тепломаш: ${totalSearchQueries.value}`);
};
</script>
<style scoped>
.search-container {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
  padding: 0.5rem 0;
}
</style>
