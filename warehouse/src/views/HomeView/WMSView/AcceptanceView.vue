<template>
  <div class="acceptance-view-container">
    <acceptance-page/>
  </div>
</template>
<script setup>
import AcceptancePage from "@/components/Main/WMS/AcceptancePage.vue";
</script>
<style scoped>
.acceptance-view-container {
  display: grid;
  align-content: start;
  margin: 0 60px;
  background-color: rgba(245, 245, 245, 0.05);
  height: 100%;
  padding: 50px 100px;
}
@media (max-width: 1024px) {
  .acceptance-view-container {
    display: grid;
    margin: 0;
    padding: 20px 20px;
  }
}
</style>