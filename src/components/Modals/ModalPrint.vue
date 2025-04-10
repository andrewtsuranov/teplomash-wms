<template>
  <div id="modalPrint"
       aria-hidden="true"
       aria-labelledby="modalPrintLabel"
       class="modal fade"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalPrintLabel"
              class="modal-title fs-5"
          >
            Параметры печати: {{ ERPStore.productTypeId?.name }}
          </h1>
          <button aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
          >
          </button>
        </div>
        <div class="modal-body">
          <form class="printer-settings-container"
                @submit.prevent="handlePrint">
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
                  :value="print"
              >
                {{ print.name }} ({{ print.ip_address }})
              </option>
            </select>
            <label for="templateSelect">Тип печати:</label>
            <select
                id="templateSelect"
                v-model="printingStore.selectedLabelTemplate"
                aria-label="Выберите шаблон этикетки"
                class="form-select"
                required
            >
              <option :value="null" disabled>Выберите шаблон этикетки...</option>
              <option
                  v-for="(label, index) in printingStore.labelTemplatesList"
                  :key="index"
                  :value="label"
              >
                {{ label.name }}
              </option>
            </select>
            <label for="quantityInput">Кол-во копий:</label>
            <div class="counter">
              <button
                  aria-label="Уменьшить количество"
                  type="button"
                  @click="printingStore.decrement"
              >&ndash;
              </button>
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
              >+
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
          <button class="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  type="button">
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
  <ModalPrintPreview/>
</template>
<script setup>
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {computed, onMounted, ref} from "vue";
import {useNumbersOnlyWithoutDot} from "@/composables/NumbersOnlyWithoutDot.js";
import ModalPrintPreview from "@/components/Modals/ModalPrintPreview.vue";

const ERPStore = useERPStore()
const printingStore = usePrintingStore()
// Вычисляемое свойство для общего количества этикеток
const totalLabels = computed(() => {
  if (!printingStore.dataToPrint) return 0;
  // Если это массив, учитываем каждый элемент
  if (Array.isArray(printingStore.dataToPrint)) {
    return printingStore.dataToPrint.length * printingStore.quantityLabel;
  }
  // Если это один объект
  return printingStore.quantityLabel;
});

// Обработчик печати
const handlePrint = async () => {

  try {
    const sendPrinterData = {
      "template_code": printingStore.selectedLabelTemplate.code,
      "printer_id": printingStore.selectedPrinter.id,
      "data": printingStore.dataToPrint,
      "copies": printingStore.quantityLabel,
      "priority": 0
    };
    switch (printingStore.selectedLabelTemplate?.name) {
      case "300_этикетка_58*40_Комплектующая":
        await printingStore.PRINT_LABEL_300_BARCODE_58x40_COMPONENTS(sendPrinterData);
        break;
      case "300_этикетка_58*40_Продукция":
        await printingStore.PRINT_LABEL_300_BARCODE_58x40_PRODUCTS(sendPrinterData);
        break;
      default:
        console.log("Неизвестный шаблон этикетки");
        break;
    }
  } catch (error) {
    console.error('Ошибка при печати:', error);
  }
};

// Обработчик предпросмотра печати
const handlePreviewPrint = async () => {
  // Проверяем, существует ли выбранный шаблон
  if (!printingStore.selectedLabelTemplate) {
    alert("Необходимо выбрать шаблон этикетки");
    return;
  }
  const getModalPrint = document.getElementById('modalPrintPreview');
  const modal = new bootstrap.Modal(getModalPrint);
  // Показываем модальное окно, так как шаблон уже проверен
  modal.show();
  switch (printingStore.selectedLabelTemplate.name) {
    case "300_этикетка_58*40_Комплектующая":
      // Если нужны дополнительные данные для компонентов, загружаем их
       await printingStore.clearDataToPreview()
       await printingStore.setDataToPreview([ERPStore.getBarcodeFromComponent])
      break;
    case "300_этикетка_58*40_Продукция":
      // Если нужны дополнительные данные для продукции, загружаем их
     await printingStore.clearDataToPreview()
     await printingStore.setDataToPreview(ERPStore.getNameAndBarcodeProductList)

      break;
    default:
      console.log("Предпросмотр для выбранного шаблона не настроен");
      break;
  }
};

</script>
<style scoped>
.printer-settings-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: min-content;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
}

.counter {
  display: grid;
  grid-template-columns: 3rem 5rem 3rem;
  font-size: 1.2rem;
}

.counter button {
  height: 100%;
  border: 1px solid #514D4C;
}

.counter input {
  display: grid;
  text-align: center;
  border: 1px solid #514D4C;
  outline: none;
  background: none;
}

</style>