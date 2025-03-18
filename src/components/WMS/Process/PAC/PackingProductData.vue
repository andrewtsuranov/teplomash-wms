<template>
  <div v-if="packingStore.isShownTableItemUnregProduct"
       class="packing-product-data-container">
    <label class="packing-product-data-title">
      Информация об упаковке продукции {{ packingStore.detailInfoPackingProduct?.name }}:
    </label>
    <div v-if="packingStore.detailInfoPackingProduct?.error">
      <div class="modal-grid-msg">
        <div>
          <label>Найдены следующие ошибки:</label>
          <ul>
            <li v-for="(err, index) in errorMessages" :key="index">
              {{ err }}
            </li>
          </ul>
        </div>
        <div>
          <label>Создать тип паллеты</label>
          <div class="template-link-pallet-container">
            <div class="template-link-pallet">
              <label>Наименование</label>
              <input aria-label="default input example" class="form-control" data-bs-theme="dark" placeholder="Default input"
                     type="text">
              <label>Выберите тип поддона</label>
              <select aria-label="Default select example" class="form-select" data-bs-theme="dark">
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              <label>Кол-во:</label>
              <div class="counter">
                <button @click="printingStore.decrement">&ndash;</button>
                <input v-model.number.trim="printingStore.quantityLabel"
                       min="1"
                       v-on:keypress="useNumbersOnlyWithoutDot"
                />
                <button @click="printingStore.increment">+</button>
              </div>
              <label>Габариты:</label>
              <div></div>
              <label>Длина:</label>
              <input aria-label="default input example" class="form-control" data-bs-theme="dark" placeholder="Default input"
                     type="text">
              <label>Ширина:</label>
              <input aria-label="default input example" class="form-control" data-bs-theme="dark" placeholder="Default input"
                     type="text">
              <label>Высота:</label>
              <input aria-label="default input example" class="form-control" data-bs-theme="dark" placeholder="Default input"
                     type="text">
            </div>
            <button>Создать</button>
          </div>
        </div>
      </div>
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
            <li>{{ ERPStore.palletTypeId?.name }}</li>
          </ul>
          <label>Габариты паллеты:</label>
          <ul>
            <li>{{ ERPStore.palletTypeId?.length }} x {{ ERPStore.palletTypeId?.width }} x
                {{ ERPStore.palletTypeId?.height }} (мм)
            </li>
          </ul>
          <label>Тип поддона:</label>
          <ul>
            <li>{{ ERPStore.getBasePallet?.code }} &mdash; 1200 x {{ ERPStore.getBasePallet?.width }} x 145 (мм)
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

const ERPStore = useERPStore()
const packingStore = usePackingStore()
const printingStore = usePrintingStore()
const warehouseStore = useWarehouseStore()
const totalCountProductPallet = computed(() => {
  return ERPStore.palletTypeId.rows_length * ERPStore.palletTypeId.rows_width * ERPStore.palletTypeId.rows_height
})
const totalWeightPallet = computed(() => {
  return Number(ERPStore.getBasePallet.weight) + (Math.round(Number(ERPStore.productTypeId.max_weight) * totalCountProductPallet.value))
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

.template-link-pallet-container {
  display: grid;
  grid-template-columns: minmax(auto, 400px);
  grid-template-rows: minmax(auto, 1fr);
}

.template-link-pallet {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.counter {
  display: grid;
  grid-template-columns: 3rem 5rem 3rem;
  font-size: 1.2rem;
}
</style>