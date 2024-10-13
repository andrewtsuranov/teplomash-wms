<template>
  <div class="header-container">
    <nav class="nav">
      <RouterLink to="/"><i class="bi bi-house-door-fill"></i>Войти</RouterLink>
    </nav>
    <nav class="nav">
      <!--      <RouterLink to="/"><i class="bi bi-house-door-fill"></i></RouterLink>-->
    </nav>
    <nav class="nav">
      <!--      <RouterLink to="/"><i class="bi bi-house-door-fill"></i></RouterLink>-->
    </nav>
  </div>
</template>
<script setup>
</script>
<style scoped>
.header-container {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 50px;
  padding: 0 50px;
}

nav a {
  color: dimgray;
  text-decoration: none;
}

nav .teplomash-active-exact-link {
  background-color: rgba(255, 255, 255, 0.1);
}

a:hover {
  /*background: none;*/
}

i {
  font-size: 1.3rem;
}
</style>