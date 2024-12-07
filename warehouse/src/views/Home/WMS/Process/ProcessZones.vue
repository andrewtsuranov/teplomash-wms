<template>
  <div class="process-zone-container">
    <div v-for="item in zones" :key="item.code" class="process-zone">
      <router-link :to="{ name: processRouteName, params: { code: item.code } }">
        {{ item.name.replace(/_/g, ' ') }}
      </router-link>
    </div>
    <RouterView/>
  </div>
</template>
<script setup>
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {computed} from "vue";

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
  border: 2px double #E32029;
  font-size: 2rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
  align-content: center;
}

.process-zone span {
  display: grid;
  justify-items: center;
  text-align: center;
}

.process-zone:hover {
  background-color: #2F2D2B;
}
</style>