<script setup>
import ERPData from "@/components/WMS/Process/PAC/ERPData.vue";
import PackingProductData from "@/components/WMS/Process/PAC/PackingProductData.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import ModalPrint from "@/components/Modals/ModalPrint.vue";
import PalletData from "@/components/WMS/Process/PAC/PalletData.vue";
</script>
<template>
  <div class="wms-packing-container">
    <ERPData/>
    <PackingProductData/>
    <TeplomashTaskManager/>
    <PalletData/>
    <ModalPrint/>
  </div>
</template>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: 1fr;
  row-gap: 2rem;
}
</style>
