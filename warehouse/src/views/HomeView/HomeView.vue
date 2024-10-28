<template>
  <div class="general-page">
    <general-page/>
  </div>
</template>
<script setup>
import GeneralPage from "@/components/Main/GeneralPage.vue";
</script>
<style scoped>
.general-page {
  display: grid;
  background-color: rgba(245, 245, 245, 0.05);
  margin: 0 60px;
  height: 100%;
  place-content: center;
}
@media (max-width: 1024px) {
  .general-page {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;

  }
}
</style>