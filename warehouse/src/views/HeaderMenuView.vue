<template>
  <div class="header-container">
    <header-menu/>
  </div>
</template>
<script setup>
import HeaderMenu from "@/components/HeaderMenu.vue";
</script>
<style scoped>
.header-container {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 50px;
  padding: 0 50px;
}


</style>