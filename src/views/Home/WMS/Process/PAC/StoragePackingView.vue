<script setup>
import ERPData from "@/components/WMS/Process/PAC/ERPData.vue";
import PalletTypeData from "@/components/WMS/Process/PAC/PalletTypeData.vue";
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import ModalPrint from "@/components/Modals/ModalPrint.vue";
import PalletPackingData from "@/components/WMS/Process/PAC/PalletPackingData.vue";
import PalletPackingTEST from "@/components/WMS/Process/PAC/PalletPackingTEST.vue";
</script>
<template>
  <div class="wms-packing-container">
    <ERPData/>
    <PalletTypeData/>
    <TeplomashTaskManager/>
    <PalletPackingData/>
    <PalletPackingTEST/>
    <ModalPrint/>
  </div>
</template>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: 1fr;
  row-gap: 2rem;
}
</style>
