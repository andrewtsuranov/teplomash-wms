<template>
  <div class="in-table-container table-responsive">
    <table class="table-content table table-dark align-middle table-hover">
      <thead>
      <tr>
        <th>№</th>
        <th>Изделие</th>
        <th>Зав.номер</th>
        <th>Выпуск</th>
      </tr>
      </thead>
      <tbody v-if="ERPStore.minItemsByIdUnreg">
      <tr v-for="(item, index) in ERPStore.minItemsByIdUnreg" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ packingStore.detailInfoPackingProduct?.name }}</td>
        <td style="color: coral">{{ item.barcode }}</td>
        <td>
          {{ useSplitDateByT(item.created_at).date }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import { useSplitDateByT } from "@/composables/SpliDateByT.js";
import { usePackingStore } from "@/stores/WMSStores/PackingStore.js";

const packingStore = usePackingStore();
const ERPStore = useERPStore();
</script>
<style scoped>
.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  max-height: 370px;
  overflow: auto;
}
table thead {
  box-shadow: 0 1px 0 0 red;
  position: sticky;
  top: 0;
  z-index: 1;
}
@media (max-width: 800px) {
  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }
}
</style>
