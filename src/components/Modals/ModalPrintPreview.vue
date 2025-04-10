<template>
  <div id="modalPrintPreview"
       aria-hidden="true"
       aria-labelledby="modalPrintPreviewLabel"
       class="modal fade"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalPrintPreviewLabel"
              class="modal-title fs-5"
          > Предварительный просмотр
          </h1>
          <button aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
          >
          </button>
        </div>
        <div class="modal-body">
          <div class="barcodes-container"
                v-if="barcodeData.length"
          >
            <div v-for="(item, index) in barcodeData"
                 :key="index"
                 class="barcode-item">
              <label>{{ item.name }}</label>
              <svg :id="'barcode-' + index"></svg>
            </div>
          </div>
          <div v-else class="no-data">
            Нет данных для предварительного просмотра
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary"
                  type="button"
                  @click="goBackToPrintSettings"
          >Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {ref, watch, nextTick, onMounted, computed} from "vue";
import JsBarcode from 'jsbarcode'


const ERPStore = useERPStore()
const packingStore = usePackingStore()
const printingStore = usePrintingStore()

// Определяем тип шаблона
const templateType = computed(() => {
  return printingStore.selectedLabelTemplate?.code || 'default';
});

// Количество копий
const previewCopies = computed(() => printingStore.quantityLabel || 1);


// Данные для штрих-кодов
const barcodeData = computed(() => {
  if (!printingStore.dataToPreview) return [];
  return printingStore.dataToPreview
});

// Генерация штрих-кодов
const generateBarcodes = () => {
  barcodeData.value.forEach((item, index) => {
    const element = document.getElementById(`barcode-${index}`)
    if (element) {
      try {
        JsBarcode(element, item.barcode, {
          format: 'CODE128',
          width: 3,
          height: 100,
          displayValue: true,
          marginTop: 0,
          background: 'none',
          lineColor: '#000000',
          fontSize: 30,
          font: 'Arial',
          text: `Зав.№ ${item.barcode}`,
          textAlign: "center",
        })
      } catch (error) {
        console.error(`Ошибка генерации штрих-кода для индекса ${index}:`, error)
      }
    }
  })
}

// Обработчик кнопки "Назад"
const goBackToPrintSettings = () => {
  const previewModal = document.getElementById('modalPrintPreview');
  const printModal = document.getElementById('modalPrint');

  if (previewModal && printModal) {
    const previewBsModal = bootstrap.Modal.getInstance(previewModal);
    const printBsModal = bootstrap.Modal.getOrCreateInstance(printModal);
    previewBsModal.hide();
    setTimeout(() => printBsModal.show(), 300);
  }
};

// Следим за изменением barcodeData и генерируем штрих-коды
watch(barcodeData, (newValue) => {
  if (newValue) {
    nextTick(() => {
      generateBarcodes();
    });
  }
}, { immediate: true });

</script>
<style scoped>
.barcodes-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(auto, 1fr);
  justify-items: center;
  row-gap: 1rem;
}

.barcode-item {
  display: grid;
  padding: 1rem;
  grid-template-columns: 350px;
  background: #FFFFFF;
  border-radius: 1rem;
  justify-items: center;
}

label {
  color: #000;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0 1.2rem;
  font-family: "Arial Narrow";
  line-height: 1.2;
}
.no-data {
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
}
</style>