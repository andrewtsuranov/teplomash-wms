<template>
  <div class="process-zone-container" v-if="zones">
    <div v-for="item in zones"
         :key="item.code"
         class="process-zone"
         @click="handleZoneClick(item)"
    >
      <div class="process-zone-header">{{ item?.name.replace(/_/g, ' ') }}</div>
      <div class="process-zone-info">
      <span>Общая площадь: {{ item?.total_area }} м2</span>
      <span>Занято: {{ item?.occupied_area }} м2</span>
      <span>Загруженность: {{ item?.capacity_percentage }} %</span>
      </div>
    </div>
    <RouterView/>
  </div>
</template>
<script setup>
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {computed} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
const warehouseStore = useWarehouseStore()
const props = defineProps({
  process: {
    type: String || Number,
    required: true,
  },
  processRouteName: {
    type: String,
    required: true
  }
});
const zones = computed(() => warehouseStore.customSortByZone[props.process] || []);
const handleZoneClick = (zone) => {
  warehouseStore.setSelectedZone(zone)
  router.push({name: props.processRouteName, params: {code: zone.code.toLowerCase()}})
}
</script>
<style scoped>
.process-zone-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 300px));
  padding: 0 2rem;
  grid-auto-rows: minmax(auto, 300px);
  place-content: center;
  gap: 5rem;
}

.process-zone {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto;
  border: 2px double #E32029;
  row-gap: 1rem;
  padding: .7rem;
  cursor: pointer;

}
.process-zone-header {
  text-align: center;
  text-transform: uppercase;
  font-size: 2rem;
}
.process-zone-info {
  display: grid;
  grid-auto-rows: 1fr;
  font-size: 1.3rem;
}

.process-zone:hover {
  background-color: #2F2D2B;
}

@media (max-width: 800px) {
  .process-zone-container {
    display: grid;
    row-gap: 2rem;
    padding: 1rem;
  }

  .process-zone {
    font-size: 2rem;
    padding: 10px 50px;
  }
}
</style>