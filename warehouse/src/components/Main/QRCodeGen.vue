<template>
  <div class="qrcode-container">
    <input type="text" v-model="inputData" class="form-control" placeholder="Введите данные QR кода..."
           aria-label="Recipient's username"
           aria-describedby="button-addon2">
    <input type="text" v-model="inputSize" class="form-control" placeholder="Введите размер QR кода..."
           aria-label="Recipient's username"
           aria-describedby="button-addon2">
    <input type="text" v-model="inputFormat" class="form-control" placeholder="Введите формат QR кода..."
           aria-label="Recipient's username"
           aria-describedby="button-addon2">
    <button class="btn btn-outline-secondary"
            type="button" id="button-addon2"
            @click="createURL(inputData, inputSize, inputFormat)">
      Показать
    </button>
  </div>
  <img :src=url
       class="rounded float-end"
       alt="qr-code"
  >
</template>
<script setup>
// import {useQrCodeGenStore} from "@/stores/qrCodeGenStore.js";
import {ref} from "vue";
// const qrCodeGenStore = useQrCodeGenStore()
const inputData = ref()
const inputSize = ref()
const inputFormat = ref()
const url = ref()
const createURL = (data, size, format) => {
  return url.value = `http://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${size}&format=${format}`
}
</script>
<style scoped>
.qrcode-container {
  display: grid;
}
</style>