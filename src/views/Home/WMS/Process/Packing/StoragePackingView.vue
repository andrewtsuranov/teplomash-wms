<template>
  <div class="wms-packing-container">
    <h2 v-if="warehouseStore.selectedZone">{{ warehouseStore.selectedZone.name.replace(/_/g, ' ').toUpperCase() }}</h2>
    <ERPData/>
    <PackingProductData/>
    <TeplomashTaskManager/>
    <PalletData/>
    <ModalPrint/>
  </div>
</template>
<script setup>
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import ERPData from "@/components/WMS/Process/PAC/ERPData.vue";
import PackingProductData from "@/components/WMS/Process/PAC/PackingProductData.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import PalletData from "@/components/WMS/Process/PAC/PalletData.vue";
import ModalPrint from "@/components/Modals/ModalPrint.vue";

const warehouseStore = useWarehouseStore()
const ERPStore = useERPStore()
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 2rem;
}
</style>