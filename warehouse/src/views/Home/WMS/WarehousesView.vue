<template>
  <div class="wms-home-container">
    <div v-for="warehouse in warehouseStore.allWarehouses"
         :key="warehouse.id"
         class="wms-input"
         @click="handlerClickWarehouse(warehouse.id)"
    >
      <span>{{ warehouse.name }}</span>
    </div>
  </div>
</template>
<script setup>
import {onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";

const webSocketStore = useWebSocketStore()
const warehouseStore = useWarehouseStore()
const router = useRouter()
onMounted(() => {
  warehouseStore.GET_WAREHOUSES()
})
onUnmounted(() => {
  localStorage.removeItem('warehouses')
})
const handlerClickWarehouse = async (id) => {
  await warehouseStore.WAREHOUSE_ID(id)
  await router.push({name: 'WMSProcess', params: {id: id}})

}
</script>
<style scoped>
.wms-home-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 400px));
  padding: 0 2rem;
  grid-auto-rows: minmax(auto, 400px);
  place-content: center;
  gap: 5rem;
}

.wms-input {
  border: 2px double #E32029;
  font-size: 2rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
  align-content: center;
}

.wms-input span {
  display: grid;
  justify-items: center;
}

.wms-input:hover {
  background-color: #2F2D2B;
}

@media (max-width: 800px) {
  .wms-home-container {
    display: grid;
    row-gap: 2rem;
    padding: 1rem;
  }

  .wms-input {
    font-size: 2rem;
    padding: 10px 50px;
  }
}
</style>