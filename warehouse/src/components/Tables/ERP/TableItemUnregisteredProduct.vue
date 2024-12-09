<template>
  <table v-if="ERPStore.unregProductByID"
         class="table-content table table-dark table-hover"
  >
    <thead class="table-info">
    <tr>
      <th>№</th>
      <th>Название</th>
      <th>Штрихкод</th>
      <th>Тип паллеты</th>
      <th>Дата</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, index) in ERPStore.unregProductByID?.items" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ ERPStore.unregProductByID?.product_type?.name }}</td>
      <td>
        <template v-if="ERPStore.getItemBarcode && ERPStore.getItemBarcode[index]">
          {{ ERPStore.getItemBarcode[index]?.barcode }}
        </template>
      </td>
      <td>
        <template v-if="ERPStore.getItemPalletType && ERPStore.getItemPalletType[0]">
          {{ ERPStore.getItemPalletType[0].name }}
        </template>
      </td>
      <td>{{ useSplitDateByT(item.created_at).date }} {{ useSplitDateByT(item.created_at).time }}</td>
    </tr>
    </tbody>
  </table>
  <div v-else>
    Нет данных для отображения
  </div>
</template>
<script setup>
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useSplitDateByT} from "@/composables/SpliDateByT.js";

const ERPStore = useERPStore()
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