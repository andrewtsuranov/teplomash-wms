<template>
  <div v-if="packingStore.isShownTableItemUnregProduct"
       class="packing-product-data-container">
    <label class="packing-product-data-title">
      Информация об упаковке продукции {{ packingStore.detailInfoPackingProduct?.name }}:
    </label>
    <div class="packing-product-data">
      <div class="packing-product-data-pallet">
        <div>
          <label>Тип паллеты:</label>
          <ul>
            <li>{{ ERPStore.palletTypeId.name }}</li>
          </ul>
          <label>Габариты паллеты:</label>
          <ul>
            <li>{{ ERPStore.palletTypeId.length }} x {{ ERPStore.palletTypeId.width }} x
              {{ ERPStore.palletTypeId.height }} (мм)
            </li>
          </ul>
          <label>Тип поддона:</label>
          <ul>
            <li>{{ ERPStore.getBasePallet.code }} &mdash; 1200 x {{ ERPStore.getBasePallet.width }} x 145 (мм)
            </li>
          </ul>
          <label>Изделий в паллете:</label>
          <ul>
            <li>
              {{
                ERPStore.palletTypeId.rows_length * ERPStore.palletTypeId.rows_width * ERPStore.palletTypeId.rows_height
              }}
              шт.
            </li>
          </ul>
        </div>
        <PalletConfigurator/>
      </div>
      <div class="packing-product-data-detail">
        <TableItemUnregisteredProduct/>
        <button class="btn btn-outline-primary grp-btn"
                data-bs-target="#modalPrintSettings"
                data-bs-toggle="modal"
                @click="handlerPrint"
        >
          Печать Barcode
        </button>
      </div>
      <div class="barcodes-container">
        <div v-for="(barcode, index) in ERPStore.getBarcodes"
             :key="index"
             class="barcode-item">
          <label>{{ packingStore.detailInfoPackingProduct?.name }}</label>
          <svg :id="'barcode-' + index"></svg>
        </div>
      </div>
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
  row-gap: 2rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
}

.packing-product-data-title {
  font-size: 1.7rem;
}

.packing-product-data {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content min-content 400px;
  overflow: auto;
  row-gap: 2rem;
}

.packing-product-data-pallet {
  display: grid;
  grid-template-columns: max-content minmax(auto, 1fr);
}

.packing-product-data-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 2rem;
}

.grp-btn {
  align-self: start;
}

.barcodes-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(auto, 1fr);
  justify-items: center;
  gap: 1rem;
}

.barcode-item {
  display: grid;
  padding: 1rem;
  grid-template-columns: 330px;
  background: #FFFFFF;
  border-radius: 1rem;
  justify-items: center;
}

.barcode-item label {
  color: #000;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0 1.2rem;
  font-family: "Arial Narrow";
  line-height: 1.2;
}
</style>