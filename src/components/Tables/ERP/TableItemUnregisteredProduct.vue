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
    <tbody>
    <tr v-for="(item, index) in packingStore.selectedGroupUnregProduct.data" :key="item.id">
      <td>{{ index + 1 }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.barcode }}</td>
      <td>{{ item.created_at }}</td>
    </tr>
    </tbody>
  </table>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";

const packingStore = usePackingStore()
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

th, td {
  padding: 8px;
  text-align: left;
}
</style>