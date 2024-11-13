<template>
  <div class="date-range-container">
    <label>Начало периода</label>
    <input
        id="dateD"
        v-model="dataStart"
        name="dateStart"
        type="datetime-local"
    >
    <label>Конец периода</label>
    <input
        id="dateD"
        v-model="dataEnd"
        name="dateEnd"
        type="datetime-local"
    >
    <button class="btn btn-outline-success"
            type="button"
            @click="ERPStore.GET_PRODUCT_BY_DAY(dataStart, dataEnd)"
    >Получить данные
    </button>
    <button class="btn btn-outline-success"
            type="button"
            @click="ERPStore.updateProductsData()"
    >Заполнить хар-ки
    </button>
  </div>
</template>
<script setup>
import {ref} from "vue";
import {useERPStore} from "@/stores/HTTP/WMS/1С/ERPStore.js";

const ERPStore = useERPStore()
const dataStart = ref('2022-11-10T10:00')
const dataEnd = ref('2022-11-10T11:00')
</script>
<style scoped>
.date-range-container {
  display: grid;
  grid-template-columns: minmax(auto, 250px);
  row-gap: .5rem;
}
</style>