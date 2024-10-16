<template>
  <div class="main">
    <header>
      <header-menu-view/>
    </header>
    <main>
      <RouterView/>
    </main>
  </div>
</template>
<script setup>
import HeaderMenuView from "@/views/HeaderMenuView.vue";
</script>
<style scoped>
.main {
  display: grid;
  min-width: 1280px;
  overflow: hidden;
}
</style>