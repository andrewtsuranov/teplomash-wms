<template>
  <div class="wms-home-container">
    <div class="wms-input" @click="router.push({name: 'wmsIN'})">
      Приёмка
    </div>
    <div class="wms-output" @click="router.push({name: 'wmsOUT'})">
      Отгрузка
    </div>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";
const router = useRouter()
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