<template>
  <nav class="header-nav-container">
    <router-link to="/"><i class="icon-header-wms bi bi-box-seam"></i> Управление складом</router-link>
    <router-link to="/info">Справка</router-link>
    <router-link to="/support">Поддержка</router-link>
  </nav>
</template>
<script setup>
</script>
<style scoped>
.header-nav-container {
  display: grid;
  grid-template-columns: minmax(30px, max-content) repeat(auto-fit, minmax(100px, 1fr));
  column-gap: 10px;
  place-items: center;
}

nav a {
  color: blanchedalmond;
  text-decoration: none;
}

nav .teplomash-active-exact-link {
  color: chocolate;
}

i {
  font-size: 1.3rem;
}

@media (max-width: 1024px) {
  .header-nav-container {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(3rem, max-content);
    row-gap: 0.5rem;
    place-items: stretch;
    text-transform: uppercase;
    font-size: 1.3rem;
    font-weight: bold;
  }

  nav a {
    display: grid;
    place-items: center;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .icon-header-wms {
    display: none;
  }
}
</style>