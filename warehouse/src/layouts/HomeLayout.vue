<template>
  <div class="main">
    <header>
      <nav>
        MENU
      </nav>
    </header>
    <main>
      <RouterView/>
    </main>
  </div>
</template>
<script setup>

</script>
<style scoped>
.main {
  display: grid;
  min-width: 1280px;
  overflow: hidden;
}
</style>