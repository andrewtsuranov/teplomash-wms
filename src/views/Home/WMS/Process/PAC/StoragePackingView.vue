<script setup>
import TeplomashTaskManager from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
import PalletPackingData from "@/components/WMS/Process/PAC/PalletPackingData.vue";
import PalletPackingTEST from "@/components/WMS/Process/PAC/PalletPackingTEST.vue";
import TaskQRcodes from "@/components/WMS/Process/TaskQRcodes.vue";
import ModalPrint from "@/components/Modals/ModalPrint.vue";
import ERPData from "@/components/WMS/Process/PAC/ERPData.vue";
import PalletTypeData from "@/components/WMS/Process/PAC/PalletTypeData.vue";
const props = defineProps({
  idWarehouse: String,
  code: String,
});
</script>
<template>
  <div class="wms-packing-container">
    <div class="erp-data">
      <ERPData />
      <TaskQRcodes/>
    </div>
    <PalletTypeData />
    <TeplomashTaskManager/>
<!--    <PalletPackingData/>-->
    <PalletPackingTEST/>
  </div>
  <ModalPrint />
</template>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
}
.erp-data {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) auto;
  column-gap: 2rem;
}
</style>
