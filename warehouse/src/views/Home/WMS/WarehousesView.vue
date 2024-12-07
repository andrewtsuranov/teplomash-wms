<template>
  <div class="wms-home-container">
    <div v-for="warehouse in warehouseStore?.allWarehouses"
         :key="warehouse.id"
         class="wms-input"
         @click="handlerClickWarehouse(warehouse.id)"
    >
      <span v-if="warehouse">{{ warehouse?.name }}</span>
    </div>
  </div>
</template>
<script setup>
import {onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js"

const errorStore = useErrorStore()
const warehouseStore = useWarehouseStore()
const router = useRouter()
onMounted(async () => {
  try {
    await warehouseStore.GET_WAREHOUSES()
  } catch (e) {
    errorStore.setError({
      error: e,
      message: 'Ошибка при получении склада',
      component: 'WarehousesView'
    })
    console.log(e)
  }
})
const handlerClickWarehouse = async (id) => {
  try {
    await warehouseStore.WAREHOUSE_ID(id)
    if (warehouseStore.warehouseData) {
      await router.push({
        name: 'WMSProcess',
        params: {
          alias: warehouseStore.warehouseAliasMap[id]
        }
      })
    }
  } catch (e) {
    errorStore.setError({
      error: e,
      message: 'Ошибка при получении выбранного склада',
      component: 'WarehousesView'
    })
    console.log(e)
  }
}
onUnmounted(() => {
  localStorage.removeItem('warehouses')
})
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