<template>
  <div class="wms-in-container">
    <teplomash-task-manager/>
  </div>
</template>
<script setup>
import TeplomashTaskManager from "@/components/Main/WMS/TeplomashTaskManager/TeplomashTaskManager.vue";
</script>
<style scoped>
.wms-in-container {
  display: grid;
  align-content: start;
  margin: 0 60px;
  background-color: rgba(245, 245, 245, 0.05);
  height: 100%;
  padding: 50px 100px;
}

@media (max-width: 1024px) {
  .wms-in-container {
    display: grid;
    margin: 0;
    padding: 20px 20px;
  }
}
</style>