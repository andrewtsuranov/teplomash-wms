<script setup>
import StorageMap from "@/components/WMS/Process/STR/StorageMap.vue";
import SearchResults from "@/components/WMS/Process/REC/map/SearchResults.vue";
import StorageMapDetail from "@/components/WMS/Process/STR/StorageMapDetail.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import WarehouseSearch from "@/components/WMS/Process/REC/map/WarehouseSearch.vue";
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";
import { onMounted } from "vue";
import { useWebSocketStore } from "@/stores/WebSocketStore.js";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";

const storageStore = useStorageStore();
const webSocketStore = useWebSocketStore();
const warehouseStore = useWarehouseStore();
</script>
<template>
  <div class="storage-view-container">
    <WarehouseSearch />
    <SearchResults />
    <StorageMap />
    <StorageMapDetail />
    <TeplomashTaskManager />
  </div>
</template>
<style scoped>
.storage-view-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
}
</style>
