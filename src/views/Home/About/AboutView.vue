<template>
  <div class="about-container">
    <h1>Here's gonna be reference</h1>
    <button @click="palletStore.GET_PALLET_TYPE_LIST">Get pallet type</button>
    <PalletConfigurator/>
  </div>
</template>
<script setup>
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
import {usePalletStore} from "@/stores/HTTP/PalletStore.js";

const palletStore = usePalletStore()
</script>
<style scoped>
.about-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 500px;
}
</style>