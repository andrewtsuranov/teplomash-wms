<template>
  <div v-if="packingStore.isShownTableItemUnregProduct"
       class="packing-product-data-container">
    <label class="packing-product-data-title">
      Информация об упаковке продукции {{ packingStore.detailInfoPackingProduct?.name }}:
    </label>
    <div v-if="packingStore.detailInfoPackingProduct?.error"
         class="modal-grid-msg"
    >
      <div class="alert alert-warning"
           role="alert"
           data-bs-theme="dark"
      >Ошибка:
        <ol class="mb-0">
          <li v-for="(err, index) in errorMessages" :key="index">
            {{ err }}
          </li>
        </ol>
      </div>
      <FormCreatePalletType class="packing-product-form"/>
    </div>
    <div v-else class="packing-product-data">
      <div class="packing-product-data-pallet">
        <PalletConfigurator/>
      </div>
      <div class="packing-product-data-detail">
        <TableItemUnregisteredProduct/>
        <div>
          <label>Тип паллеты:</label>
          <ul>
            <li>{{ palletStore.palletTypeByID?.name }}</li>
          </ul>
          <label>Габариты паллеты:</label>
          <ul>
            <li>{{ palletStore.palletTypeByID?.length }} x {{ palletStore.palletTypeByID?.width }} x
                {{ palletStore.palletTypeByID?.height }} (мм)
            </li>
          </ul>
          <label>Тип поддона:</label>
          <ul>
            <li>{{ palletStore.basePalletTypeById?.code }} &mdash; 1200 x {{ palletStore.basePalletTypeById?.width }} x
                145 (мм)
            </li>
          </ul>
          <label>Изделий в паллете:</label>
          <ul>
            <li>
              {{ totalCountProductPallet }} шт.
            </li>
          </ul>
          <label>Масса паллеты:</label>
          <ul>
            <li>{{ totalWeightPallet }} &#177; 1 кг.
            </li>
          </ul>
        </div>
        <button class="btn btn-outline-primary grp-btn"
                data-bs-target="#modalPrintSettings"
                data-bs-toggle="modal"
                @click="handlerPrint"
        >
          Печать Barcode
        </button>
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
import {computed} from "vue";
import {useErrorCodeDictionary} from "@/composables/Dictionary/useErrorCodeDictionary.js";
import {useNumbersOnlyWithoutDot} from "@/composables/NumbersOnlyWithoutDot.js";
import {usePalletStore} from "@/stores/HTTP/PalletStore.js";
import FormCreatePalletType from "@/components/Forms/FormCreatePalletType.vue";

const ERPStore = useERPStore()
const packingStore = usePackingStore()
const palletStore = usePalletStore()
const printingStore = usePrintingStore()
const warehouseStore = useWarehouseStore()
const totalCountProductPallet = computed(() => {
  return palletStore.palletTypeByID.rows_length * palletStore.palletTypeByID.rows_width * palletStore.palletTypeByID.rows_height
})
const totalWeightPallet = computed(() => {
  return Number(palletStore.basePalletTypeById.weight) + (Math.round(Number(ERPStore.productTypeId.max_weight) * totalCountProductPallet.value))
})
const errorMessages = computed(() => {
  if (!packingStore.detailInfoPackingProduct?.error) return []
  return packingStore.detailInfoPackingProduct.error.map(err => useErrorCodeDictionary[err] || `Неизвестная ошибка (${err})`)
})
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
  grid-template-rows: min-content min-content;
  overflow: auto;
  row-gap: 2rem;
}
.modal-grid-msg,
.packing-product-form {
  max-width: 500px;

}

.packing-product-data-pallet {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
}

.packing-product-data-detail {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: 1fr;
  column-gap: 2rem;
}

.grp-btn {
  align-self: start;
}

</style>