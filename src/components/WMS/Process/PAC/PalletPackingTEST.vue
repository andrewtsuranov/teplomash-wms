<script setup>
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";
import {computed} from "vue";

const warehouseStore= useWarehouseStore()
const palletZonePackingStatistic = computed(() =>
warehouseStore.detailedZoneStatistics?.zones[0].pallets
)
</script>
<template>
  <div class="in-table-container table-responsive">
    <table class="table-content table table-dark align-middle table-hover">
      <colgroup>
        <col style="width: 1%"/>
        <!-- № -->
        <col style="width: 10%"/>
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
      <tbody v-if="palletZonePackingStatistic">

        <tr
            v-for="(item, index) in palletZonePackingStatistic"
            :key="index"
            style="cursor: pointer"
        >
          <th scope="row">{{ index + 1 }}</th>
          <th scope="row">{{ item.pallet_type.name }}</th>
          <td>#{{item.id}}</td>
          <td>
            {{ item.barcode }}
          </td>

          <td>{{ item.items_count }}</td>
          <td>
            {{ item.is_complete }}
          </td>
        </tr>

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

</style>