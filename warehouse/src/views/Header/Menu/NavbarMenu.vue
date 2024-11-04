<template>
  <nav class="menu-container">
    <router-link :to="{name: 'Home'}"><span>Управление складом</span></router-link>
    <router-link to="/info"><span>Справка</span></router-link>
    <router-link to="/support"><span>Поддержка</span></router-link>
  </nav>
</template>
<script setup>
</script>
<style scoped>
.menu-container {
  display: grid;
  grid-auto-flow: column;
  text-transform: uppercase;
}

nav a {
  display: grid;
  color: blanchedalmond;
  text-decoration: none;
  place-items: center;
}

nav a:hover {
  background-color: #4a383882;
}

.teplomash-active-exact-link {
  color: #bc985f;
  background-color: #4a383882;
}

@media (max-width: 1024px) {
  .menu-container {
    grid-auto-flow: row;
    grid-auto-rows: minmax(3rem, max-content);
    row-gap: 0.5rem;
    font-size: 1.3rem;
    font-weight: bold;
    align-items: stretch;
  }

  nav a {
    display: grid;
    place-items: center;
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>