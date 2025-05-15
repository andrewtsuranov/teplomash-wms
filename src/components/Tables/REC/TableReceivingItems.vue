<script setup>
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import { computed } from "vue";

const warehouseStore = useWarehouseStore();

// Функция группировки данных по product_type.name
const groupItemsByProductType = (items) => {
  const grouped = items.reduce((acc, item) => {
    const productName = item.product_type.name;
    if (!acc[productName]) {
      acc[productName] = {
        product_type_name: productName,
        total_count: 0,
        barcodes: [],
      };
    }
    acc[productName].total_count += item.count;
    acc[productName].barcodes.push(item.barcode);
    return acc;
  }, {});
  return Object.values(grouped);
};

// Computed-свойство для получения сгруппированных данных
const groupedItems = computed(() => {
  const zones = warehouseStore.detailedZoneStatistics?.zones || [];
  // Собираем все items из всех зон и группируем их
  const allItems = zones.flatMap(zone => zone.items || []);
  return groupItemsByProductType(allItems);
});
</script>

<template>
  <div v-if="warehouseStore.detailedZoneStatistics?.zones[0].items.length > 0"
       class="in-table-container table-responsive">
    <table class="table-content table table-dark align-middle table-hover">
      <colgroup>
        <col style="width: 1%" />
        <!-- № -->
        <col style="width: 60%" />
        <!-- Тип изделия -->
        <col style="width: 30%" />
        <!-- Заводской номер -->
        <col style="width: 9%" />
        <!-- Кол-во -->
      </colgroup>
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Тип изделия</th>
        <th scope="col">Заводской номер</th>
        <th scope="col">Кол-во, шт</th>
      </tr>
      </thead>
      <tbody v-if="groupedItems.length > 0">
      <tr
        v-for="(group, index) in groupedItems"
        :key="group.product_type_name"
        style="cursor: pointer"
      >
        <th scope="row">{{ index + 1 }}</th>
        <th scope="row">{{ group.product_type_name }}</th>
        <td>{{ group.barcodes.join(", ") }}</td>
        <td>{{ group.total_count }}</td>
      </tr>
      </tbody>
      <!-- Показываем сообщение об отсутствии данных -->
      <tbody v-else class="in-table-empty">
      <tr class="no-hover">
        <td class="text-center py-3" colspan="4">Данные отсутствуют</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 400px;
  overflow-x: auto;
}
</style>