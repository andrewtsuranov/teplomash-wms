<template>
  <div class="about-container">
    <h1>Here's gonna be reference</h1>
    <PalletConfigurator/>
  </div>
</template>
<script setup>
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
</script>
<style scoped>
.about-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>