<template>
  <div v-if="packingStore.isShownTableItemUnregProduct"
       class="packing-product-data-container">
    <label class="packing-product-data-title">
      {{ getTitle }}
    </label>

    <!-- Отображаем контент для элемента с ошибкой -->
    <div v-if="errorItem" class="packing-product-data-error">
      <div class="error-content">
        <div v-if="errorItem.error && errorItem.error.length">
          <label>Найдены следующие ошибки:</label>
          <ul>
            <li v-for="(err, index) in errorMessages" :key="index">
              {{ err }}
            </li>
          </ul>
        </div>
        <div class="pallet-type-creation">
          <label>Создать тип паллеты</label>
          <!-- Здесь будет ваш UI для создания типа паллеты -->
        </div>
      </div>
      <div class="error-actions">
        <button class="btn btn-primary" @click="packingStore.closeTableItemUnregProduct">
          Закрыть
        </button>
      </div>
    </div>

    <!-- Отображаем стандартный контент, если нет ошибки -->
    <div v-else class="packing-product-data">
      <div class="packing-product-data-pallet">
        <PalletConfigurator/>
      </div>
      <div class="packing-product-data-detail">
        <TableItemUnregisteredProduct/>
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
  <ModalPrintSettings v-if="ERPStore.minItemsByIdUnreg && !errorItem"/>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
import ModalPrintSettings from "@/components/Modals/ModalPrintSettings.vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";
import {computed, inject, ref} from "vue";
import {useErrorCodeDictionary} from "@/composables/Dictionary/useErrorCodeDictionary.js";

const ERPStore = useERPStore()
const packingStore = usePackingStore()
const printingStore = usePrintingStore()
const warehouseStore = useWarehouseStore()

// Получаем значение из provide
const errorItem = inject('errorItem', ref(null))

// Преобразуем коды ошибок в читаемые сообщения
const errorMessages = computed(() => {
  if (!errorItem.value?.error) return []
  return errorItem.value.error.map(err => useErrorCodeDictionary[err] || `Неизвестная ошибка (${err})`)
})

// Вычисляем заголовок в зависимости от типа отображаемой информации
const getTitle = computed(() => {
  if (errorItem.value) {
    return `Ошибка в изделии: ${errorItem.value.name}`
  }
  return `Информация об упаковке продукции ${packingStore.detailInfoPackingProduct?.name}:`
})

const totalCountProductPallet = computed(() => {
  return ERPStore.palletTypeId.rows_length * ERPStore.palletTypeId.rows_width * ERPStore.palletTypeId.rows_height
})

const totalWeightPallet = computed(() => {
  return Number(ERPStore.getBasePallet.weight) + (Math.round(Number(ERPStore.productTypeId.max_weight) * totalCountProductPallet.value))
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
</style>