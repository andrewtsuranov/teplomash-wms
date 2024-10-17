<template>
  <div class="header-container">
    <header-menu/>
    <header-search/>
    <header-profile/>
  </div>
</template>
<script setup>
import HeaderMenu from "@/components/Header/HeaderMenu.vue";
import HeaderSearch from "@/components/Header/HeaderSearch.vue";
import HeaderProfile from "@/components/Header/HeaderProfile.vue";
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