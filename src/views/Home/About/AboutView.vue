<template>
  <div class="container-fluid">
    <h1 class="my-4">Warehouse Management System</h1>
    <WarehouseSearch/>
    <div v-if="storageStore.error" class="alert alert-danger">
      {{ storageStore.error }}
    </div>
    <SearchResults/>
    <WarehouseTopView/>
    <RackProfileView/>
  </div>
</template>
<script setup>
import {useStorageStore} from "@/stores/HTTP/StorageStore.js";

const storageStore = useStorageStore()
import WarehouseSearch from "@/components/WMS/Process/REC/map/WarehouseSearch.vue";
import SearchResults from "@/components/WMS/Process/REC/map/SearchResults.vue";
import WarehouseTopView from "@/components/WMS/Process/REC/WarehouseTopView.vue";
import RackProfileView from "@/components/WMS/Process/REC/RackProfileView.vue";
</script>