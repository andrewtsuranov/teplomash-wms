<script setup>
import { usePackingStore } from "@/stores/WMSStores/PackingStore.js";
import { usePrintingStore } from "@/stores/WMSStores/PrintingStore.js";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import PalletConfigurator from "@/components/UI/SVG/Pallet/PalletConfigurator.vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";
import { computed, nextTick } from "vue";
import { useErrorCodeDictionary } from "@/composables/Dictionary/useErrorCodeDictionary.js";
import { usePalletStore } from "@/stores/WMSStores/PalletStore.js";
import FormCreatePalletType from "@/components/Forms/FormCreatePalletType.vue";
import { useRoute } from "vue-router";

const ERPStore = useERPStore();
const warehouseStore = useWarehouseStore();
const packingStore = usePackingStore();
const palletStore = usePalletStore();
const printingStore = usePrintingStore();
const route = useRoute();
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
      Number(ERPStore.productTypeId.max_weight) * totalCountProductPallet.value
    )
  );
});
const errorMessages = computed(() => {
  if (!packingStore.detailInfoPackingProduct?.error) return [];
  return packingStore.detailInfoPackingProduct.error.map(
    (err) => useErrorCodeDictionary[err] || `Неизвестная ошибка (${err})`
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
        printer => printer.zones.find(
          zone => zone.id === warehouseStore.selectedZonesByZoneType.id
        )
      );
      if (printerInZone) {
        await printingStore.setSelectedPrinter(printerInZone);
      }
      if (route.params.idWarehouse !== "spb-revolyutsii-sklad-komplektuyuschih") {
        if (printingStore.selectedPrinter.name !== "BIXOLON_SPP-L410 WiFi") {
          await printingStore.setSelectedLabelTemplate(
            printingStore.labelTemplatesList.find(
              (label) => label.code === "300_этикетка_58*40_Продукция"
            )
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
  <div v-if="packingStore.isShownTableItemUnregProduct"
       class="packing-product-data-container"
  >
    <label class="packing-product-data-title">
      Информация об упаковке продукции {{ packingStore.detailInfoPackingProduct?.name }}:
    </label>
    <div v-if="packingStore.detailInfoPackingProduct?.error"
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
      <div class="packing-product-data-table">
        <TableItemUnregisteredProduct />
        <div class="grp-btn">
          <button class="btn btn-outline-primary" @click="handlerPrint">
            Печать этикеток
          </button>
        </div>
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
  grid-template-columns: repeat(2, minmax(auto, 1fr));
  grid-template-rows: min-content min-content min-content;
  grid-template-areas:
    "pallet pallet"
    "detail table"
    "buttons buttons";
  overflow: auto;
  gap: 2rem;
}

.packing-product-form {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(auto, 1fr);
}

.packing-product-data-pallet {
  grid-area: pallet;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

.packing-product-data-detail {
  grid-area: detail;
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
  grid-area: table;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 1rem;
  min-width: 500px;
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

.grp-btn {
  display: grid;
  /*border: 1px solid #605039e0;*/
  border-radius: .5rem;
  place-items: center;
}
@media (max-width: 768px) {
  .packing-product-data {
    grid-template-columns: 1fr;
    grid-template-areas:
      "pallet"
      "detail"
      "table"
  }

  .packing-product-data-table {
    min-width: unset;
  }
}
</style>
