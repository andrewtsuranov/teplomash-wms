<template>
  <div
    v-if="packingStore.isShownTableItemUnregProduct"
    class="packing-product-data-container"
  >
    <label class="packing-product-data-title">
      Информация об упаковке продукции
      {{ packingStore.detailInfoPackingProduct?.name }}:
    </label>
    <div
      v-if="packingStore.detailInfoPackingProduct?.error"
      class="modal-grid-msg"
    >
      <div class="alert alert-warning" data-bs-theme="dark" role="alert">
        Ошибка:
        <ol class="mb-0">
          <li v-for="(err, index) in errorMessages" :key="index">
            {{ err }}
          </li>
        </ol>
      </div>
      <FormCreatePalletType class="packing-product-form" />
    </div>
    <div v-else class="packing-product-data">
      <div class="packing-product-data-pallet">
        <PalletConfigurator />
      </div>
      <div class="packing-product-data-detail">
        <TableItemUnregisteredProduct />
        <div>
          <label>Тип паллеты:</label>
          <ul>
            <li>{{ palletStore.palletTypeByID?.name }}</li>
          </ul>
          <label>Габариты паллеты:</label>
          <ul>
            <li>
              {{ palletStore.palletTypeByID?.length }} x
              {{ palletStore.palletTypeByID?.width }} x
              {{ palletStore.palletTypeByID?.height }} (мм)
            </li>
          </ul>
          <label>Тип поддона:</label>
          <ul>
            <li>
              {{ palletStore.basePalletTypeById?.code }} &mdash; 1200 x
              {{ palletStore.basePalletTypeById?.width }} x 145 (мм)
            </li>
          </ul>
          <label>Изделий в паллете:</label>
          <ul>
            <li>{{ totalCountProductPallet }} шт.</li>
          </ul>
          <label>Масса паллеты:</label>
          <ul>
            <li>{{ totalWeightPallet }} &#177; 1 кг.</li>
          </ul>
        </div>
        <button class="btn btn-outline-primary grp-btn" @click="handlerPrint">
          Печать Barcode
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { usePackingStore } from "@/stores/HTTP/PackingStore.js";
import { usePrintingStore } from "@/stores/HTTP/PrintingStore.js";
import { useWarehouseStore } from "@/stores/HTTP/WarehouseStore.js";
import { useERPStore } from "@/stores/HTTP/ERPStore.js";
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";
import { computed, nextTick } from "vue";
import { useErrorCodeDictionary } from "@/composables/Dictionary/useErrorCodeDictionary.js";
import { usePalletStore } from "@/stores/HTTP/PalletStore.js";
import FormCreatePalletType from "@/components/Forms/FormCreatePalletType.vue";

const ERPStore = useERPStore();
const packingStore = usePackingStore();
const palletStore = usePalletStore();
const printingStore = usePrintingStore();
const warehouseStore = useWarehouseStore();
const totalCountProductPallet = computed(() => {
  return (
    palletStore.palletTypeByID.rows_length *
    palletStore.palletTypeByID.rows_width *
    palletStore.palletTypeByID.rows_height
  );
});
const totalWeightPallet = computed(() => {
  return (
    Number(palletStore.basePalletTypeById.weight) +
    Math.round(
      Number(ERPStore.productTypeId.max_weight) * totalCountProductPallet.value,
    )
  );
});
const errorMessages = computed(() => {
  if (!packingStore.detailInfoPackingProduct?.error) return [];
  return packingStore.detailInfoPackingProduct.error.map(
    (err) => useErrorCodeDictionary[err] || `Неизвестная ошибка (${err})`,
  );
});
const handlerPrint = async () => {
  try {
    await nextTick();
    const modalElement = document.getElementById("modalPrint");
    if (!modalElement) {
      console.log("Модальное окно не найдено");
      return;
    }
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
    if (ERPStore.minItemsByIdUnreg.length > 0) {
      printingStore.clearDataToPrint();
      printingStore.setDataToPrint(ERPStore.getNameAndBarcodeProductList);
    }
    await printingStore.GET_ZPL_PRINTERS();
    await printingStore.GET_LABEL_TEMPLATE();
    if (warehouseStore.selectedZone.id) {
      const printerInZone = printingStore.printersList.printers.find(
        (printer) => printer.zone === warehouseStore.selectedZone.id,
      );
      if (printerInZone) {
        await printingStore.setSelectedPrinter(printerInZone);
      }
      if (ERPStore.isProductsActive) {
        if (printingStore.selectedPrinter.name !== "BIXOLON_SPP-L410 WiFi") {
          await printingStore.setSelectedLabelTemplate(
            printingStore.labelTemplatesList.find(
              (label) => label.code === "300_этикетка_58*40_Продукция",
            ),
          );
        }
      }
      if (ERPStore.isComponentsActive) {
        if (printingStore.selectedPrinter.name !== "BIXOLON_SPP-L410 WiFi") {
          await printingStore.setSelectedLabelTemplate(
            printingStore.labelTemplatesList.find(
              (label) => label.code === "300_этикетка_58*40_Комплектующая",
            ),
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
</script>
<style scoped>
.packing-product-data-container {
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content minmax(auto, 1fr);
  padding: 1rem;
  row-gap: 2rem;
}

.packing-product-data-title {
  font-size: 1.7rem;
}

.packing-product-data {
  align-items: start;
  display: grid;
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
  column-gap: 2rem;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: 1fr;
}

.grp-btn {
  align-self: start;
}
</style>
