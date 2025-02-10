<template>
  <div class="wms-packing-container">
    <h2 v-if="warehouseStore.selectedZone">{{ warehouseStore.selectedZone.name.replace(/_/g, ' ').toUpperCase() }}</h2>
    <ERPData/>
    <PackingProductData/>
    <TeplomashTaskManager/>
    <PalletData/>
  </div>
</template>
<script setup>
import ERPData from "@/components/WMS/Process/PAC/ERPData.vue";
import PackingProductData from "@/components/WMS/Process/PAC/PackingProductData.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import PalletData from "@/components/WMS/Process/PAC/PalletData.vue";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {onUnmounted} from "vue";

const warehouseStore = useWarehouseStore()
const packingStore = usePackingStore();
onUnmounted(() => {
  warehouseStore.clearSelectedZone()
})
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 2rem;
}
</style>