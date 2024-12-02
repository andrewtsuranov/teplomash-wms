<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
    <e-r-p-view/>
    <TeplomashTaskManagerView/>
    <pallet-data/>

  </div>
</template>
<script setup>
import TeplomashTaskManagerView from "@/components/TeplomashTaskManager/TeplomashTaskManagerView.vue";
import PalletData from "@/components/PalletData/PalletData.vue";
import ERPView from "@/views/Home/WMS/Process/Packing/Data/ERPView.vue";
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 1rem;
}
</style>