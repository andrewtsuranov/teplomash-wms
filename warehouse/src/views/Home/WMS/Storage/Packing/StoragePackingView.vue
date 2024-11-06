<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
    <div class="grid-container">
      <div v-for="n in 12" :key="n" class="grid-item">
        <span class="pallet-name">Паллета ID#{{ n }} </span>
      </div>
    </div>
    <canvas id="canvas"></canvas>
    <div>
      <router-view name="TTM"/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import QRCode from 'qrcode'
const canvasEl = ref(null)
// const QRCode = require('qrcode')
const canvas = document.getElementById('canvas')
onMounted(() => {
  generateQR(ee)
})
const ee = 'asfsafs'
const generateQR = async ee => {
  try {
    canvasEl.value = await QRCode.toDataURL(ee)
  } catch (err) {
    console.error(err)
  }
}
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;

}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;

}

.grid-item {
  /*border: 2px solid #4CAF50;*/
  border: 2px solid #E8B53F;
  /*border: 2px solid #B01010;*/

  padding: 1rem;
  border-radius: 0.5rem;
  min-height: 250px;
}

.pallet-name {
  font-size: 1.2rem;
}
</style>