<script setup>
import TableReceivingPalletProduct from "@/components/Tables/REC/TableReceivingPalletProduct.vue";
import TableReceivingItems from "@/components/Tables/REC/TableReceivingItems.vue";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";

defineProps({
  idWarehouse: String,
  zone_type: String,
  code: String
});
const warehouseStore = useWarehouseStore();
</script>
<template>
  <div class="wms-receiving-container">
    <TableReceivingPalletProduct />
    <TableReceivingItems />
  </div>
</template>
<style scoped>
.wms-receiving-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
}
</style>
