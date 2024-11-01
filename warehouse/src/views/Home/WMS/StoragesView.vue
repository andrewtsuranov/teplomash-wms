<template>
  <div class="wms-home-container">
    <div v-for="item in storageStore.fullListWarehouses"
         class="wms-input"
         @click="handlerClickStorage(item.id)"
    >Склад Тепломаш {{ item.name }}
    </div>
  </div>
</template>
<script setup>
import {onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import {useStorageStore} from "@/stores/HTTP/WMS/StorageStore.js";

const userStore = useUserStore()
const storageStore = useStorageStore()
const router = useRouter()
const route = useRoute()
onMounted(() => {
  storageStore.GET_WAREHOUSES()
})
const handlerClickStorage = async (id) => {
  await storageStore.WAREHOUSE_ID(id)
  router.push({name: 'WMSStorage', params: {id: id}})
  localStorage.removeItem('warehouses')
}
</script>
<style scoped>
.wms-home-container {
  display: grid;
  overflow: hidden;
  grid-template-columns: 1fr;
  justify-items: center;
  gap: 5rem;
}

.wms-input {
  border: 2px double #E32029;
  font-size: 5rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
}

.wms-input:hover {
  background-color: #42b983;
}

.wms-output {
  border: 2px double #E32029;
  font-size: 5rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
}

.wms-output:hover {
  background-color: #42b983;
}

@media (max-width: 1024px) {
  .general-page-container {
    display: grid;
    row-gap: 2rem;
  }

  .wms-input, .wms-output {
    font-size: 2rem;
    padding: 10px 50px;
  }

}
</style>