<script setup>
import {usePrintingStore} from "@/stores/WMSStores/PrintingStore.js";
import {watch, nextTick, computed, onMounted, onUnmounted} from "vue";
import JsBarcode from "jsbarcode";
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";

const printingStore = usePrintingStore();
const warehouseStore = useWarehouseStore()
// Данные для штрих-кодов
const barcodeData = computed(() => {
  if (!printingStore.dataToPreview) return [];
  return printingStore.dataToPreview;
});
// Генерация штрих-кодов
const generateBarcodes = () => {
  barcodeData.value.forEach((item, index) => {
    const element = document.getElementById(`barcode-${index}`);
    const textBarcode = warehouseStore.selectedWarehouse.id === 1
        ? `Зав.№ ${item.barcode}`
        : warehouseStore.selectedWarehouse.id === 6
            ? item.barcode || "N/A"
            : item.barcode || [];
    if (element) {
      try {
        JsBarcode(element, item.barcode, {
          format: "CODE128",
          width: 2.5,
          height: 100,
          displayValue: true,
          marginTop: 0,
          background: "none",
          lineColor: "#000000",
          fontSize: 30,
          font: "Arial",
          text: textBarcode,
          textAlign: "center",
        });
      } catch (error) {
        console.error(
            `Ошибка генерации штрих-кода для индекса ${index}:`,
            error,
        );
      }
    }
  });
};
// Обработчик кнопки "Назад"
const goBackToPrintSettings = () => {
  const previewModal = document.getElementById("modalPrintPreview");
  const printModal = document.getElementById("modalPrint");
  if (previewModal && printModal) {
    const previewBsModal = bootstrap.Modal.getInstance(previewModal);
    const printBsModal = bootstrap.Modal.getOrCreateInstance(printModal);
    previewBsModal.hide();
    setTimeout(() => printBsModal.show(), 300);
  }
};
// Следим за изменением barcodeData и генерируем штрих-коды
watch(
    barcodeData,
    (newValue) => {
      if (newValue) {
        nextTick(() => {
          generateBarcodes();
        });
      }
    },
    {immediate: true},
);
</script>
<template>
  <div
      id="modalPrintPreview"
      aria-labelledby="modalPrintPreviewLabel"
      class="modal fade"
      data-bs-theme="dark"
      tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalPrintPreviewLabel" class="modal-title fs-5">
            Предварительный просмотр
          </h1>
          <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="barcodeData.length" class="barcodes-container">
            <div
                v-for="(item, index) in barcodeData"
                :key="index"
                class="barcode-item"
            >
              <label>{{ item.name }}</label>
              <svg :id="'barcode-' + index"></svg>
            </div>
          </div>
          <div v-else class="no-data">
            Нет данных для предварительного просмотра
          </div>
        </div>
        <div class="modal-footer">
          <button
              class="btn btn-primary"
              type="button"
              @click="goBackToPrintSettings"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.barcodes-container {
  display: grid;
  grid-auto-rows: minmax(auto, 1fr);
  grid-template-columns: 1fr;
  justify-items: center;
  row-gap: 1rem;
}

.barcode-item {
  background: #ffffff;
  border-radius: 1rem;
  display: grid;
  grid-template-columns: 350px;
  justify-items: center;
  padding: 1rem;
}

label {
  color: #000;
  font-family: "Arial Narrow";
  font-size: 1.6rem;
  font-weight: bold;
  line-height: 1.2;
  padding: 0 1.2rem;
}

.no-data {
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
  padding: 2rem;
}
</style>
