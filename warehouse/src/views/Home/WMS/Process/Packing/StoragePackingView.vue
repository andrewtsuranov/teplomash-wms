<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
    <table-group-unregistered-products/>
    <TeplomashTaskManagerView/>
    <pallet-data/>
<!--    <div>-->
    <!--      <router-view name="TTM"/>-->
    <!--    </div>-->
  </div>
</template>
<script setup>
import TeplomashTaskManagerView from "@/components/TeplomashTaskManager/TeplomashTaskManagerView.vue";
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import PalletData from "@/components/PalletData/PalletData.vue";
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 1rem;
}
</style>