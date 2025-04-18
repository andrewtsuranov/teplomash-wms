<template>
  <div class="authorization-layout">
    <login-view />
  </div>
</template>
<script setup>
import LoginView from "@/views/Authorization/AuthorizationView.vue";
</script>
<style scoped>
.authorization-layout {
  display: grid;
  grid-template-columns: minmax(auto, 1440px);
  grid-template-rows: 1fr;
  justify-content: center;
  height: 100%;
}
</style>
