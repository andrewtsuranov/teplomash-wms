<template>
  <div class="storage-id-container">
    <div class="storage-id-title">
      <div>Склад {{ warehouseStore.warehouseData.number }}: {{ warehouseStore.warehouseData.name }},
           {{ warehouseStore.warehouseData.address }} [ Ёмкость: {{ warehouseStore.warehouseData.max_capacity }} ячеек ]
      </div>
    </div>
    <div  class="storage-id-actions">

      <router-link v-for="(process, index) in warehouseStore.customSortByZone"
                   :to="{name: 'wmsPackingZone'}"
                   class="storage-id-actions-items"
      > {{index}}
      </router-link>
      <router-link :to="{name: 'wmsInventory'}"
                   class="storage-id-actions-items"
      >Инвентаризация
      </router-link>
      <router-link :to="{name: 'wmsReporting'}"
                   class="storage-id-actions-items"
      >Аналитика
      </router-link>
    </div>
    <div class="storage-id-terminal">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {onMounted, onUnmounted} from "vue";
defineProps({
  id: Number
})
const warehouseStore = useWarehouseStore()
onMounted( async () => {
  await warehouseStore.GET_ALl_ZONE_TYPES()
  await warehouseStore.GET_WAREHOUSES_ZONE_BY_ID({
    warehouse_id: warehouseStore.getWarehouseId
  })
})

</script>
<style scoped>
.storage-id-container {
  display: grid;
  grid-template-areas:
      ". storageTitle"
      "storageActions storageTerminal";
  grid-template-columns: minmax(auto, max-content) 1fr;
  grid-template-rows:min-content 1fr;
  gap: 1.5rem;
  padding: 0 1rem;
}

.storage-id-title {
  grid-area: storageTitle;
  display: grid;
  grid-template-columns: 1fr;
  font-size: 1.3rem;
  color: #9B9482;
  border-bottom: 1px solid #9B9482;
  padding-bottom: .2rem;
}

.storage-id-actions {
  grid-area: storageActions;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  font-size: 1.5rem;
  row-gap: 2rem;
  cursor: pointer;
}

.storage-id-actions-items {
  display: grid;
  padding: 1rem 5px;
  border: 1px solid #9B9482;
  border-radius: 1rem;
  text-align: center;
}

.storage-id-actions-items:hover {
  background: #9B9482;
}

.storage-id-terminal {
  grid-area: storageTerminal;
  overflow: hidden;
}

.teplomash-active-exact-link {
  background-color: #9B9482;
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