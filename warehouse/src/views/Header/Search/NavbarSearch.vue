<template>
  <div class="search-container">
    <BFormInput class="me-2" placeholder="Поиск Тепломаш..."/>
    <BButton type="submit" variant="outline-success">Поиск</BButton>
  </div>
</template>
<script setup>
</script>
<style scoped>
.search-container {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
  padding: .5rem 0;
}
</style>