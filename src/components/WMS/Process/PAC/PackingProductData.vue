<template>
  <div v-if="packingStore.isShownTableItemUnregProduct && packingStore.selectedGroupUnregProduct"
       class="packing-product-data-container">
    <div class="packing-product-data">
      <div class="packing-product-data-title">
        Информация об упаковке продукции: [ {{ packingStore.selectedGroupUnregProduct.key }} ]
      </div>
      <div class="packing-product-data-table">
        <table-item-unregistered-product/>
      </div>
      <div class="packing-product-data-printing">
        <button class="btn btn-outline-primary"
                data-bs-target="#modalPrintSettings"
                data-bs-toggle="modal"
                @click="handlerPrint"
        >
          Печать Barcode
        </button>
        <button class="btn btn-outline-primary"
                data-bs-target="#modalPrintSettings"
                data-bs-toggle="modal"
                @click="handlerPrint"
        >
          Печать Nameplate
        </button>
      </div>
    </div>
    <ModalPrintSettings/>
  </div>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";
import ModalPrintSettings from "@/components/Modals/ModalPrintSettings.vue";

const packingStore = usePackingStore()
const printingStore = usePrintingStore()
const warehouseStore = useWarehouseStore()
const handlerPrint = async () => {
  try {
    await printingStore.getZPLPrinters()
    await printingStore.getLabelTemplate()
    if (warehouseStore.selectedZone.id) {
      const printerInZone = printingStore.printersList.printers
          .find(printer => printer.zone === warehouseStore.selectedZone.id);
      if (printerInZone) {
        await printingStore.setSelectedPrinter(printerInZone)
      }
    }
    await printingStore.setSelectedLabelTemplate(
        printingStore.labelTemplatesList
            .find(label => label.code.toLowerCase() === 'code-128'
            ))
    await printingStore.setSelectedQuantityLabel(packingStore.selectedGroupUnregProduct.data.length)
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

.packing-product-data-printing {
  display: grid;
  grid-template-columns: minmax(auto, max-content);
  grid-template-rows: min-content min-content;
  row-gap: 1rem;
}
</style>