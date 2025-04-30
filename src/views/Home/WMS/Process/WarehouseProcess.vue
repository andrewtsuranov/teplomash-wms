<script setup>
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";
import {computed, onMounted} from "vue";
import {useWebSocketStore} from "@/stores/WebSocketStore.js";
import {useRoute, useRouter} from "vue-router";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";

const warehouseStore = useWarehouseStore();
const webSocketStore = useWebSocketStore()
const errorStore = useErrorStore()
const router = useRouter()
const route = useRoute()
const getRouteName = (process) => {
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
}
const handleClickWarehouseProcess = async (zone) => {
  try {
    if (zone) {
      await warehouseStore.setSelectedZone(zone)
      await router.push({
        name: getRouteName(zone.name),
        params: {zone_type: zone.code.toLowerCase()}
      })
    }
  } catch (e) {
    errorStore.setError({
      error: e,
      message: "Ошибка при получении выбранной зоны",
      component: "WarehousesProcess",
    });
    console.log(e);
  }
}
onMounted(async () => {
    try {
      if (warehouseStore.selectedWarehouse) {
      await webSocketStore.GET_WAREHOUSE_ZONE_STATISTICS(warehouseStore.selectedWarehouse.id)
        // await handleClickWarehouseProcess(warehouseStore.selectedZone)
      }
    }catch (e) {
      console.log(e)
    }
})

</script>
<template>
  <div class="storage-id-container">
    <div class="storage-id-title">
      <div>
        {{ warehouseStore.selectedWarehouse?.name.replace(/_/g, "-").toUpperCase() }}
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
      <nav
          v-for="(zone, index) in warehouseStore.zoneStatisticsByWarehouseID?.zone_types"
          :key="index"
          class="storage-id-actions-items"
          @click="handleClickWarehouseProcess(zone)"
      >
        {{ zone.name }}
      </nav>
    </div>
    <div class="storage-id-terminal">
      <!-- Основное представление (ProcessZones.vue) -->
      <router-view :key="route.params.zone_type"></router-view>
      <!-- Представление для зон  -->
      <router-view name="packing"></router-view>
      <router-view name="receiving"></router-view>
      <router-view name="storage"></router-view>
      <router-view name="shipping"></router-view>
    </div>
  </div>
</template>
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
  cursor: pointer;
}

.storage-id-terminal {
  grid-area: storageTerminal;
  overflow: hidden;
}

.teplomash-active-exact-link {
  background-color: #4a383882;
  border: 1px solid #486693;
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
