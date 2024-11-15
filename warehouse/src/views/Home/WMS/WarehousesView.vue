<template>
  <div class="wms-home-container">
    <!--    <div v-for="item in storageStore.fullListWarehouses"-->
    <!--         :key="item.id"-->
    <!--         class="wms-input"-->
    <!--         @click="handlerClickStorage(item.id)"-->
    <!--    >Склад {{ item.number }}: {{ item.name }}-->
    <div v-for="item in storageStore.fullListWarehouses"
         :key="item.id"
         class="wms-input"
         @click="handlerClickStorage(item.id)"
    ><span>{{ item.name }}</span>
    </div>
  </div>
</template>
<script setup>
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {useStorageStore} from "@/stores/HTTP/WMS/StorageStore.js";

const storageStore = useStorageStore()
const router = useRouter()
onMounted(() => {
  storageStore.GET_WAREHOUSES()
})
const handlerClickStorage = async (id) => {
  await storageStore.WAREHOUSE_ID(id)
  await router.push({name: 'WMSStorage', params: {id: id}})
  localStorage.removeItem('warehouses')
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