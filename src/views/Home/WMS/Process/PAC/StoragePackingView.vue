<template>
  <div class="wms-packing-container">
    <h2 v-if="warehouseStore.selectedZone">
      {{ warehouseStore.selectedZone.name.replace(/_/g, " ").toUpperCase() }}
    </h2>
    <ERPData />
    <PackingProductData />
    <TeplomashTaskManager />
    <PalletData />
    <ModalPrint />
  </div>
</template>
<script setup>
import { useWarehouseStore } from "@/stores/HTTP/WarehouseStore.js";
import ERPData from "@/components/WMS/Process/PAC/ERPData.vue";
import PackingProductData from "@/components/WMS/Process/PAC/PackingProductData.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import PalletData from "@/components/WMS/Process/PAC/PalletData.vue";
import ModalPrint from "@/components/Modals/ModalPrint.vue";

const warehouseStore = useWarehouseStore();
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: 1fr;
  row-gap: 2rem;
}
</style>
