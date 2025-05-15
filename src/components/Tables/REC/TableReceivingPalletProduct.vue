<script setup>
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";

const warehouseStore = useWarehouseStore()
</script>
<template>
  <div v-if="warehouseStore.detailedZoneStatistics?.zones[0].pallets.length > 0"
       class="in-table-container table-responsive">
    <table class="table-content table table-dark align-middle table-hover">
      <colgroup>
        <col style="width: 1%"/>
        <!-- № -->
        <col style="width: 15%"/>
        <!-- Изделие -->
        <col style="width: 5%"/>
        <!-- Изделие -->
        <col style="width: 20%"/>
        <!-- Изделие -->
        <col style="width: 10%"/>
        <!-- Кол-во -->
        <col style="width: 8%"/>
        <!-- Инфо -->
      </colgroup>
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Тип паллеты</th>
        <th scope="col">Паллета №</th>
        <th scope="col">УИН паллеты</th>
        <th scope="col">Кол-во, шт</th>
        <th scope="col">Комплектность</th>
      </tr>
      </thead>
      <tbody v-if="true">
      <template v-for="(item, index) in warehouseStore.detailedZoneStatistics?.zones"
                :key="index"
      >
        <tr
            v-for="(item, index) in item.pallets"
            :key="index"
            style="cursor: pointer"
        >
          <th scope="row">{{ index + 1 }}</th>
          <th scope="row">{{ item.pallet_type.name }}</th>
          <td>
            #{{ item.id }}
          </td>
          <td>
            {{ item.barcode }}
          </td>
          <td>{{ item.items_count }}</td>
          <td>
            {{ item.is_complete }}
          </td>
        </tr>
      </template>
      </tbody>
      <!-- Показываем сообщение об отсутствии данных в противном случае -->
      <tbody v-else class="in-table-empty">
      <tr class="no-hover">
        <td class="text-center py-3" colspan="5">Данные отсутствуют</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 1fr;
  overflow-x: auto;
}
</style>