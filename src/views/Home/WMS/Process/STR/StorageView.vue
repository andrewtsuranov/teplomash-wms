<template>
  <div>
    <div class="wms-receiving-map">
      <h3 class="my-4">Карта склада</h3>
      <WarehouseSearch />
      <div v-if="storageStore.error" class="alert alert-danger">
        {{ storageStore.error }}
      </div>
      <SearchResults />
      <WarehouseTopView />
      <RackProfileView />
    </div>
    <TeplomashTaskManager />
  </div>
</template>
<script setup>
import WarehouseTopView from "@/components/WMS/Process/REC/WarehouseTopView.vue";
import SearchResults from "@/components/WMS/Process/REC/map/SearchResults.vue";
import RackProfileView from "@/components/WMS/Process/REC/RackProfileView.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import WarehouseSearch from "@/components/WMS/Process/REC/map/WarehouseSearch.vue";
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";


const storageStore = useStorageStore();
</script>
<style scoped>
.wms-receiving-map {
  display: grid;
}
</style>
