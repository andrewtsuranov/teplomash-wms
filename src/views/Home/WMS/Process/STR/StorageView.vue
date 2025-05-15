<script setup>
import WarehouseTopView from "@/components/WMS/Process/REC/WarehouseTopView.vue";
import SearchResults from "@/components/WMS/Process/REC/map/SearchResults.vue";
import RackProfileView from "@/components/WMS/Process/REC/RackProfileView.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import WarehouseSearch from "@/components/WMS/Process/REC/map/WarehouseSearch.vue";
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";
import {onMounted} from "vue";
import {useWebSocketStore} from "@/stores/WebSocketStore.js";
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";


const storageStore = useStorageStore();
const webSocketStore = useWebSocketStore()
const warehouseStore = useWarehouseStore()
onMounted(() => {
  webSocketStore.GET_LOCATIONS_BASE(
      warehouseStore.selectedWarehouse.id,
      warehouseStore.selectedZonesByZoneType.id,
      null,
      true,
      null
  )
})
</script>
<template>
  <div>
    <div class="wms-receiving-map">
      <h3 class="my-4">Карта склада</h3>
      <!--      <WarehouseSearch />-->
      <div v-if="storageStore.error" class="alert alert-danger">
        {{ storageStore.error }}
      </div>
      <!--      <SearchResults />-->
      <WarehouseTopView />
      <RackProfileView />
    </div>
    <TeplomashTaskManager />
  </div>
</template>
<style scoped>
.wms-receiving-map {
  display: grid;
}
</style>
