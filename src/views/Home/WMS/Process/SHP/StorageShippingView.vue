<script setup>
import TableReceivingPalletProduct from "@/components/Tables/REC/TableReceivingPalletProduct.vue";
</script>
<template>
  <div class="wms-receiving-container">
    <TableReceivingPalletProduct />
  </div>
</template>
<style scoped>
.wms-receiving-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 1rem;
}

</style>
