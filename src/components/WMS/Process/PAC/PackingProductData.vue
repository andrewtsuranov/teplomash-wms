<template>
  <div v-if="packingStore.isShownTableItemUnregProduct"
       class="packing-product-data-container">
    <label class="packing-product-data-title">
      Информация об упаковке продукции: {{ packingStore.detailInfoPackingProduct?.name }}
    </label>
    <div class="packing-product-data">
      <div>Характеристики</div>
      <PalletConfigurator/>
      <TableItemUnregisteredProduct/>
      <button class="btn btn-outline-primary"
              data-bs-target="#modalPrintSettings"
              data-bs-toggle="modal"
              @click="handlerPrint"
      >
        Печать Barcode
      </button>
    </div>
  </div>
  <ModalPrintSettings v-if="ERPStore.minItemsByIdUnreg"/>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
import ModalPrintSettings from "@/components/Modals/ModalPrintSettings.vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";

const ERPStore = useERPStore()
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
    // await printingStore.setSelectedQuantityLabel(ERPStore.unregItemsById.items.length)
  } catch (e) {
    console.log(e)
    throw e
  }
}
</script>
<style scoped>
.packing-product-data-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content minmax(auto, 1fr);
  row-gap: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
}

.packing-product-data {
  display: grid;
  align-items: start;
  grid-template-columns: auto auto;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
}

.packing-product-data-title {
  font-size: 1.7rem;
}
</style>