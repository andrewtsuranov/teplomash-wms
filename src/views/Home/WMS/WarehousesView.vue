<script setup>
import {onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {useTransliterate} from "@/composables/useTransliterate.js";

const errorStore = useErrorStore();
const warehouseStore = useWarehouseStore();
const router = useRouter();
const route = useRoute()
// Фильтрация складов по адресу
const revolutsiiWarehouses = () =>
    warehouseStore?.allWarehouses?.filter((warehouse) =>
        ['195279, Санкт-Петербург, шоссе Революции, д.90, литера А'].includes(warehouse.address)) || [];
const himikovWarehouses = () =>
    warehouseStore?.allWarehouses?.filter((warehouse) =>
        ['195030, Санкт-Петербург, улица Химиков, д.14'].includes(warehouse.address)) || [];
const handlerClickWarehouse = async (warehouse) => {
  try {
    if (warehouse) {
      await warehouseStore.setSelectedWarehouse(warehouse)
      await router.push({
        name: "WMSProcess",
        params: {
          idWarehouse: useTransliterate(warehouse.name).replace(/[\s_]+/g, "-"),
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
onMounted(async () => {
  try {
    await warehouseStore.GET_ALL_WAREHOUSES();
  } catch (e) {
    errorStore.setError({
      error: e,
      message: "Ошибка при получении списка складов",
      component: "WarehousesView",
    });
    console.log(e);
  }
});
</script>
<template>
  <div v-if="route.name === 'WMS'"
       class="wms-container">
    <!-- Группа СПБ-Революции -->
    <div class="wms-revolutsii">
      <h2>СПБ-Революции</h2>
      <div class="wms-revolutsii-warehouses">
        <div
            v-for="warehouse in revolutsiiWarehouses()"
            :key="warehouse.id"
            class="wms-revolutsii-warehouses-items"
            @click="handlerClickWarehouse(warehouse)"
        >
          <span>{{ warehouse.name.split('_').slice(1).join(' ') }}</span>
        </div>
      </div>
    </div>
    <!-- Группа СПБ-Химиков -->
    <div class="wms-himikov">
      <h2>СПБ-Химиков</h2>
      <div class="wms-himikov-warehouses">
        <div
            v-for="warehouse in himikovWarehouses()"
            :key="warehouse.id"
            class="wms-himikov-warehouses-items"
            @click="handlerClickWarehouse(warehouse)"
        >
          <span>{{ warehouse.name.split('_').slice(1).join(' ') }}</span>
        </div>
      </div>
    </div>
  </div>
  <RouterView/>
</template>
<style scoped>
.wms-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 2rem;
  gap: 5rem;
}

.wms-revolutsii,
.wms-himikov {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content auto;
  row-gap: 1rem;
  border: 2px solid rgba(138, 138, 138, 0.25);
  padding: 1rem;
}

.wms-revolutsii-warehouses,
.wms-himikov-warehouses {
  display: grid;
  grid-template-columns: repeat(auto-fill, 1fr);
  gap: 1rem;
}

.wms-revolutsii-warehouses-items,
.wms-himikov-warehouses-items {
  display: grid;
  padding: 10px;
  font-size: 1.2rem;
  text-align: center;
  place-items: center;
  border: 2px solid #e32029;
  text-transform: uppercase;
}

.wms-revolutsii-warehouses-items:hover,
.wms-himikov-warehouses-items:hover {
  background-color: #2f2d2b;
  cursor: pointer;
}

h2 {
  font-size: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  color: rgba(138, 138, 138, 0.71);
}

@media (max-width: 800px) {
  .wms-container {
    grid-template-columns: 1fr;
    padding: 1rem;
    row-gap: 2rem;
  }

  .wms-revolutsii-warehouses-items,
  .wms-himikov-warehouses-items {
    font-size: 1.2rem; /* Еще меньший шрифт для мобильных */
    width: 200px;
    height: 200px;
    padding: 10px;
  }
}
</style>