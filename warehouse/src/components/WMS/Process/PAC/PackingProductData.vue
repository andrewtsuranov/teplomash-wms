<template>
  <div v-if="packingStore.selectedGroupUnregProduct"
       class="packing-product-data-container">
    <div class="packing-product-data">
      <div class="packing-product-data-title">
        Информация об упаковке продукции: [ {{ packingStore.selectedGroupUnregProduct.key }} ]
      </div>
      <div class="packing-product-data-table">
        <table-item-unregistered-product/>
      </div>
      <div>
        <button class="btn btn-outline-primary" data-bs-target="#modalPrintSettings" data-bs-toggle="modal"
                @click="handlerPrint">
          Печать Barcode
        </button>
        <ModalPrintSettings/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";
import ModalPrintSettings from "@/components/Modals/ModalPrintSettings.vue";

const packingStore = usePackingStore()
const printingStore = usePrintingStore()
const handlerPrint = async () => {
  try {
    await printingStore.getZPLPrinters()
    await printingStore.getLabelTemplate()
  } catch (e) {
    console.log(e)
    throw e
  }
}
</script>
<style scoped>
.packing-product-data-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
}

.packing-product-data {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: min-content 1fr;
  gap: 1rem;
}

.packing-product-data-title {
  font-size: 1.7rem;
  grid-column: 1/3;
}

.packing-product-data-table {
}
</style>