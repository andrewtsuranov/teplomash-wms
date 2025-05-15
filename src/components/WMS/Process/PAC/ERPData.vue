<script setup>
import { useWebSocketStore } from "@/stores/WebSocketStore.js";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import FormSearchComponents from "@/components/Forms/FormSearchComponents.vue";
import { usePackingStore } from "@/stores/WMSStores/PackingStore.js";

const warehouseStore = useWarehouseStore();
const webSocketStore = useWebSocketStore();
const ERPStore = useERPStore();
const packingStore = usePackingStore();
</script>
<template>
  <div class="wms-packing-erp">
    <div class="erp-data">
      <!--      Таблица комплектующих-->
      <div v-if="warehouseStore.selectedWarehouse?.id === 6">
        <FormSearchComponents />
      </div>
      <!--      Таблица продукции ERP-->
      <div v-else>
        <table-group-unregistered-products />
      </div>
    </div>
  </div>
</template>
<style scoped>
.wms-packing-erp {
  display: grid;
  grid-template-columns: 1fr;
}

.erp-data {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-auto-rows: min-content;
  row-gap: 2rem;
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

@media (max-width: 800px) {

}
</style>
