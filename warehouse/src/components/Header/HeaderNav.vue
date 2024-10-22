<template>
  <nav class="header-nav-container">
    <router-link to="/users"><i class="bi bi-box-seam"></i> Управление складом</router-link>
    <router-link to="/">О нас</router-link>
    <router-link to="/">Контакты</router-link>
  </nav>
</template>
<script setup>
</script>
<style scoped>
.header-nav-container {
  display: grid;
  grid-template-columns: minmax(30px, max-content) repeat(auto-fit, minmax(100px, 1fr));
  column-gap: 10px;
  align-items: center;
  justify-items: center;

}


nav a {
  color: blanchedalmond;
  text-decoration: none;
}

nav .teplomash-active-exact-link {
  /*background-color: rgba(255, 255, 255, 0.1);*/
  color: violet;
}

i {
  font-size: 1.3rem;
}

@media (max-width: 1024px) {
  .header-nav-container {
    grid-template-columns: 1fr;
    row-gap: 10px;
    justify-items: center;
  }
}
</style>