<script setup>
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import { usePrintingStore } from "@/stores/WMSStores/PrintingStore.js";
import { computed } from "vue";
import { useNumbersOnlyWithoutDot } from "@/composables/NumbersOnlyWithoutDot.js";
import ModalPrintPreview from "@/components/Modals/ModalPrintPreview.vue";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";

const ERPStore = useERPStore();
const printingStore = usePrintingStore();
const warehouseStore = useWarehouseStore();
// Вычисляемое свойство для общего количества этикеток
const totalLabels = computed(() => {
  if (!printingStore.dataToPrint || !Number.isInteger(printingStore.quantityLabel))
    return 0;
  // Если это массив, учитываем каждый элемент
  if (Array.isArray(printingStore.dataToPrint)) {
    return printingStore.dataToPrint.length * printingStore.quantityLabel;
  }
  // Если это один объект
  return printingStore.quantityLabel;
});
// Обработчик печати
const handlePrint = async () => {
  if (!printingStore.selectedPrinter || !printingStore.selectedLabelTemplate || !printingStore.quantityLabel) {
    alert("Заполните все поля для печати");
    return;
  }
  try {
    const sendPrinterData = {
      template_code: printingStore.selectedLabelTemplate.code,
      printer_id: printingStore.selectedPrinter.id,
      data: printingStore.dataToPrint,
      copies: printingStore.quantityLabel,
      priority: 0
    };
    switch (printingStore.selectedLabelTemplate.name) {
      case "300_этикетка_58*40_Комплектующая":
        await printingStore.PRINT_LABEL_300_BARCODE_58x40_COMPONENTS(
          sendPrinterData
        );
        break;
      case "300_этикетка_58*40_Продукция":
        await printingStore.PRINT_LABEL_300_BARCODE_58x40_PRODUCTS(
          sendPrinterData
        );
        break;
      default:
        console.log(
          "Неизвестный шаблон этикетки",
          printingStore.selectedLabelTemplate.code
        );
        break;
    }
  } catch (error) {
    console.error("Ошибка при печати:", error);
  }
};
// Функция для выбора данных в зависимости от ID склада
const getPreviewData = async () => {
  let data = [];
  switch (warehouseStore.selectedWarehouse.id) {
    case 6:
      // Предполагаю, что getBarcodeFromComponent возвращает массив или значение
      data = Array.isArray(ERPStore.getBarcodeFromComponent)
        ? ERPStore.getBarcodeFromComponent.filter(Boolean)
        : [ERPStore.getBarcodeFromComponent].filter(Boolean);
      break;
    case 1:
      data = ERPStore.getNameAndBarcodeProductList || [];
      break;
    default:
      data = [];
      break;
  }
  return printingStore.setDataToPreview(data);
};
// Обработчик предпросмотра
const handlePreviewPrint = async () => {
  // Проверяем, существует ли выбранный шаблон
  if (!printingStore.selectedLabelTemplate) {
    alert("Необходимо выбрать шаблон этикетки");
    return;
  }
  await printingStore.clearDataToPreview();
  await getPreviewData()
  const modalElement = document.getElementById("modalPrintPreview");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
};
</script>
<template>
  <div
    id="modalPrint"
    aria-labelledby="modalPrintLabel"
    class="modal fade"
    data-bs-theme="dark"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalPrintLabel" class="modal-title fs-5">
            Параметры печати: {{ ERPStore.productTypeId?.name }}
          </h1>
          <button
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            type="button"
          ></button>
        </div>
        <div class="modal-body">
          <form
            class="printer-settings-container"
            @submit.prevent="handlePrint"
          >
            <label for="printerSelect">Сетевой принтер:</label>
            <select
              id="printerSelect"
              v-model="printingStore.selectedPrinter"
              aria-label="Выберите принтер"
              class="form-select"
              required
            >
              <option :value="null" disabled>Выберите принтер...</option>
              <option
                v-for="(print, index) in printingStore.printersList?.printers"
                :key="index"
                :disabled="print.name === 'BIXOLON_SPP-L410 WiFi'"
                :value="print"
              >
                {{ print.name }} ({{ print.ip_address }})
              </option>
            </select>
            <label for="templateSelect">Тип печати:</label>
            <div>
              {{ printingStore.selectedLabelTemplate?.name || "Шаблон не задан!" }}
            </div>
            <label for="quantityInput">Кол-во копий:</label>
            <div class="counter">
              <button
                aria-label="Уменьшить количество"
                type="button"
                @click="printingStore.decrement"
              >&ndash;</button>
              <input
                id="quantityInput"
                v-model.number.trim="printingStore.quantityLabel"
                min="1"
                required
                v-on:keypress="useNumbersOnlyWithoutDot"
              />
              <button
                aria-label="Увеличить количество"
                type="button"
                @click="printingStore.increment"
              >
                +
              </button>
            </div>
            <label>Всего этикеток:</label>
            <div>{{ totalLabels }} шт.</div>
            <div class="form-buttons">
              <button
                class="btn btn-outline-info"
                type="button"
                @click="handlePreviewPrint"
              >
                Просмотр
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            type="button"
          >
            Отменить
          </button>
          <button
            class="btn btn-outline-success"
            type="submit"
            @click="handlePrint"
          >
            Печать
          </button>
        </div>
      </div>
    </div>
  </div>
  <ModalPrintPreview />
</template>
<style scoped>
.printer-settings-container {
  align-items: center;
  display: grid;
  font-size: 1.1rem;
  gap: 1rem;
  grid-auto-rows: min-content;
  grid-template-columns: auto 1fr;
}

.counter {
  display: grid;
  font-size: 1.2rem;
  grid-template-columns: 3rem 5rem 3rem;
}

.counter button {
  border: 1px solid #514d4c;
  height: 100%;
}

.counter input {
  background: none;
  border: 1px solid #514d4c;
  display: grid;
  outline: none;
  text-align: center;
}
</style>
