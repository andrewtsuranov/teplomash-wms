<template>
  <table class="table-content table table-dark table-hover">
    <thead class="table-info">
    <tr>
      <th>№</th>
      <th>Название</th>
      <th>Штрихкод</th>
      <th>Дата</th>
    </tr>
    </thead>
    <tbody v-if=" ERPStore.unregItemsById">
    <tr v-for="(item, index) in ERPStore.unregItemsById.items" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.barcode }}</td>
      <td>{{ useSplitDateByT(item.created_at).date}} {{useSplitDateByT(item.created_at).time}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useSplitDateByT} from "@/composables/SpliDateByT.js";

const ERPStore = useERPStore()
const packingStore = usePackingStore()
</script>
<style scoped>

table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>