<template>
  <div class="packing-product-data-table">
  <table class="table table-dark table-hover">
    <thead class="table-info">
    <tr>
      <th>№</th>
      <th>Название</th>
      <th>Штрихкод</th>
      <th>Дата</th>
    </tr>
    </thead>
    <tbody v-if=" ERPStore.minItemsByIdUnreg">
    <tr v-for="(item, index) in ERPStore.minItemsByIdUnreg" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ packingStore.detailInfoPackingProduct?.name }}</td>
      <td>{{ item.barcode }}</td>
      <td>{{ useSplitDateByT(item.created_at).date }} {{ useSplitDateByT(item.created_at).time }}</td>
    </tr>
    </tbody>
  </table>
  </div>
</template>
<script setup>
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useSplitDateByT} from "@/composables/SpliDateByT.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";

const packingStore = usePackingStore()
const ERPStore = useERPStore()
</script>
<style scoped>
.packing-product-data-table {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  overflow: auto;
  max-height: 370px;
}
table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>