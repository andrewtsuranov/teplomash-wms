<template>
  <div class="storage-id-container">
    <div class="storage-id-title">
      <div>
        Склад {{ warehouseStore.warehouseData?.number }}:
        {{ warehouseStore.warehouseData?.name }},
        {{ warehouseStore.warehouseData?.address }} [ Ёмкость:
        {{ warehouseStore.warehouseData?.max_capacity }}
        ячеек ]
      </div>
    </div>
    <div
      v-if="warehouseStore.loading"
      class="spinner-border text-warning"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else class="storage-id-actions">
      <router-link
        v-for="(zones, process) in warehouseStore.customSortByZone"
        :key="process"
        :to="{ name: getRouteName(process) }"
        class="storage-id-actions-items"
      >
        {{ process }}
      </router-link>
      <!--      <router-link :to="{name: 'wmsInventory'}"-->
      <!--                   class="storage-id-actions-items"-->
      <!--      >Инвентаризация-->
      <!--      </router-link>-->
      <!--      <router-link :to="{name: 'wmsReporting'}"-->
      <!--                   class="storage-id-actions-items"-->
      <!--      >Аналитика-->
      <!--      </router-link>-->
    </div>
    <div class="storage-id-terminal">
      <RouterView />
    </div>
  </div>
</template>
<script setup>
import { useWarehouseStore } from "@/stores/HTTP/WarehouseStore.js";
import { computed, onMounted } from "vue";
import { useErrorStore } from "@/stores/Error/ErrorStore.js";

defineProps({
  id: Number,
});
const errorStore = useErrorStore();
const warehouseStore = useWarehouseStore();
const getRouteName = computed(() => (process) => {
  switch (process) {
    case "Упаковка":
      return "wmsPackingZone";
    case "Приёмка":
      return "wmsReceivingZone";
    case "Хранение":
      return "wmsStorageZone";
    case "Отгрузка":
      return "wmsShippingZone";
    default:
      return "wmsPackingZone"; // Или какой-то дефолтный маршрут
  }
});
onMounted(async () => {
  try {
    await warehouseStore.GET_WAREHOUSES_ZONE_BY_ID({
      warehouse_id: warehouseStore.getWarehouseId,
    });
  } catch (e) {
    console.log(e);
    errorStore.setError("Ошибка в WarehouseProcess");
    throw e;
  }
});
</script>
<style scoped>
.storage-id-container {
  display: grid;
  grid-template-areas:
    ". storageTitle"
    "storageActions storageTerminal";
  grid-template-columns: minmax(auto, max-content) 1fr;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  padding: 0 1rem;
}

.storage-id-title {
  grid-area: storageTitle;
  display: grid;
  grid-template-columns: 1fr;
  font-size: 1.3rem;
  color: #9b9482;
  border-bottom: 1px solid #9b9482;
  padding-bottom: 0.2rem;
}

.storage-id-actions {
  grid-area: storageActions;
  display: grid;
  grid-template-columns: minmax(180px, auto);
  grid-auto-rows: min-content;
  font-size: 1.5rem;
  row-gap: 2rem;
}

.storage-id-actions-items {
  display: grid;
  padding: 1rem 5px;
  border: 1px solid #9b9482;
  border-radius: 1rem;
  text-align: center;
}

.storage-id-actions-items:hover {
  background: #4a383882;
}

.storage-id-terminal {
  grid-area: storageTerminal;
  overflow: hidden;
}

.teplomash-active-exact-link {
  background-color: #4a383882;
  border: 1px solid #486693;
}

a {
  color: inherit;
  text-decoration: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 800px) {
  .storage-id-container {
    display: grid;
    grid-template-areas:
      "storageTitle"
      "storageActions"
      "storageTerminal";
    grid-template-columns: 1fr;
    grid-template-rows: min-content;
    gap: 2rem;
    padding: 0 1rem;
  }

  .storage-id-title {
    font-size: 1rem;
  }

  .storage-id-actions {
    row-gap: 1rem;
  }
}

@media (max-width: 1260px) {
  .storage-id-container {
    display: grid;
    grid-template-areas:
      "storageTitle"
      "storageActions"
      "storageTerminal";
    grid-template-columns: 1fr;
  }
}
</style>
