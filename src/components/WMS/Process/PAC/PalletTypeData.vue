<script setup>
import {usePackingStore} from "@/stores/WMSStores/PackingStore.js";
import {usePrintingStore} from "@/stores/WMSStores/PrintingStore.js";
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";
import {useERPStore} from "@/stores/WMSStores/ERPStore.js";
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";
import {computed, nextTick} from "vue";
import {useErrorCodeDictionary} from "@/composables/Dictionary/useErrorCodeDictionary.js";
import {usePalletStore} from "@/stores/WMSStores/PalletStore.js";
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
    if (warehouseStore.selectedZone) {
      const printerInZone = printingStore.printersList.printers.find(
          (printer) => printer.zone === warehouseStore.selectedZonesByZoneType.id,
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
      <FormCreatePalletType class="packing-product-form"/>
    </div>
    <div v-else class="packing-product-data">
      <PalletConfigurator class="packing-product-data-pallet"/>
      <div class="packing-product-data-table">
        <TableItemUnregisteredProduct/>
      </div>
      <div class="packing-product-data-detail">
        <label>Тип паллеты:</label>
        <div>{{ palletStore.palletTypeByID?.name }}</div>
        <label>Габариты паллеты:</label>
        <div>
          {{ palletStore.palletTypeByID?.length }} x
          {{ palletStore.palletTypeByID?.width }} x
          {{ palletStore.palletTypeByID?.height }} (мм)
        </div>
        <label>Тип поддона:</label>
        <div>
          {{ palletStore.basePalletTypeById?.code }} &mdash; 1200 x
          {{ palletStore.basePalletTypeById?.width }} x 145 (мм)
        </div>
        <label>Изделий в паллете:</label>
        <div>{{ totalCountProductPallet }} шт.</div>
        <label>Масса паллеты:</label>
        <div>{{ totalWeightPallet }} &#177; 1 кг.</div>
      </div>
      <div class="grp-btn">
        <button class="btn btn-outline-primary" @click="handlerPrint">
          Печать этикеток
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.packing-product-data-container {

  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content minmax(auto, 1fr);
  row-gap: 2rem;
}

.packing-product-data-title {
  padding: .4rem 1.5rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
  font-size: 1.7rem;
}

.packing-product-data {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) auto;
  grid-template-rows: min-content min-content;
  overflow: auto;
  gap: 2rem;
}

.packing-product-form {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(auto, 1fr);
}

.packing-product-data-pallet {
  display: grid;
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
  grid-template-columns: minmax(auto, 1fr);
}

.packing-product-data-detail {
  display: grid;
  grid-template-columns: auto auto;
  color: silver;
  font-size: 1.2rem;
  padding: .5rem 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

.packing-product-data-table {
  display: grid;
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

.grp-btn {
  display: grid;
  border: 1px solid #605039e0;
  border-radius: .5rem;
  place-items: center;

}
</style>
