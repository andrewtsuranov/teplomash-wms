<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/users">Пользователи</router-link>
  </nav>
</template>
<script setup>
</script>
<style scoped>
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
</style>