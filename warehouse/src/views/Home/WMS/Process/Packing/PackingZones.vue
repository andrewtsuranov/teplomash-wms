<template>
  <div class="packing-zone-container">
    <div v-for="(item, index) in warehouseStore.customSortByZone['Упаковка']"
         class="packing-zone"
    >
<!--      <span>{{ item.name.replace(/_/g, ' ')}}</span>-->
      <router-link :to="{name: 'wmsPacking', params: {code: item.code}}"
      >
        {{ item.name.replace(/_/g, ' ') }}
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
const route = useRoute()
const warehouseStore = useWarehouseStore()
onMounted(async () => {

  // await warehouseStore.GET_WAREHOUSES_ZONE_BY_ID({
  //   warehouse_id: warehouseStore.warehouseId,
  //   zone_type_id: true
  // })
})
</script>
<style scoped>
.packing-zone-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 300px));
  padding: 0 2rem;
  grid-auto-rows: minmax(auto, 300px);
  place-content: center;
  gap: 5rem;
}

.packing-zone {
  border: 2px double #E32029;
  font-size: 2rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
  align-content: center;

}

.packing-zone span {
  display: grid;
  justify-items: center;
  text-align: center;
}
.packing-zone:hover {
  background-color: #2F2D2B;
}
</style>