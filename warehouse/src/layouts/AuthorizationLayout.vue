<template>
  <div class="authorization-layout">
    <login-view />
  </div>
</template>
<script setup>
import LoginView from "@/views/AuthorizationView/AuthorizationView.vue";
</script>
<style scoped>
.authorization-layout {
  display: grid;
  grid-auto-columns: minmax(auto, 1350px);
  place-content: center;
}

</style>