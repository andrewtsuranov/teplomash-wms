<template>
  <div class="wms-in-container">
    <in-table/>
    <teplomash-task-manager/>
  </div>
</template>
<script setup>
import TeplomashTaskManager from "@/views/Home/WMS/TeplomashTaskManager/TeplomashTaskManagerView.vue";
import InTable from "@/views/Home/WMS/Storage/GReceiptFrom/Data/ReceiptListView.vue";
</script>
<style scoped>
.wms-in-container {
  display: grid;
  grid-auto-rows: minmax(1fr, auto);
  row-gap: 5rem;
  margin: 0 60px;
  background-color: rgba(245, 245, 245, 0.05);
  height: 100%;
  padding: 3rem;
}

@media (max-width: 1024px) {
  .wms-in-container {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;
    padding: 20px 20px;
  }
}
</style>