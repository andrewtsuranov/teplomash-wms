<template>
  <div v-if="$route.name === 'WMS'" class="wms-home-container">
    <div
      v-for="warehouse in warehouseStore?.allWarehouses"
      :key="warehouse.id"
      class="wms-input"
      @click="handlerClickWarehouse(warehouse.id)"
    >
      <span v-if="warehouse">{{ warehouse?.name }}</span>
    </div>
  </div>
  <RouterView />
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWarehouseStore } from "@/stores/HTTP/WarehouseStore.js";
import { useErrorStore } from "@/stores/Error/ErrorStore.js";

const errorStore = useErrorStore();
const warehouseStore = useWarehouseStore();
const router = useRouter();
onMounted(async () => {
  try {
    await warehouseStore.GET_ALL_WAREHOUSES();
  } catch (e) {
    errorStore.setError({
      error: e,
      message: "Ошибка при получении склада",
      component: "WarehousesView",
    });
    console.log(e);
  }
});
const handlerClickWarehouse = async (id) => {
  try {
    await warehouseStore.GET_WAREHOUSE_BY_ID(id);
    if (warehouseStore.warehouseData) {
      await router.push({
        name: "WMSProcess",
        params: {
          idWarehouse: warehouseStore.warehouseAliasMap[id],
        },
      });
    }
  } catch (e) {
    errorStore.setError({
      error: e,
      message: "Ошибка при получении выбранного склада",
      component: "WarehousesView",
    });
    console.log(e);
  }
};
</script>
<style scoped>
.wms-home-container {
  display: grid;
  gap: 5rem;
  grid-auto-rows: minmax(auto, 400px);
  grid-template-columns: repeat(auto-fit, minmax(auto, 400px));
  padding: 0 2rem;
  place-content: center;
}

.wms-input {
  align-content: center;
  border: 2px double #e32029;
  cursor: pointer;
  font-size: 2rem;
  padding: 10px;
  text-transform: uppercase;
}

.wms-input span {
  display: block;
  text-align: center;
}

.wms-input:hover {
  background-color: #2f2d2b;
}

@media (max-width: 800px) {
  .wms-home-container {
    display: grid;
    padding: 1rem;
    row-gap: 2rem;
  }

  .wms-input {
    font-size: 2rem;
    padding: 10px 50px;
  }
}
</style>
