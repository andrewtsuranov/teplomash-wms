<template>
  <div id="modalPrintSettings"
       aria-hidden="true"
       aria-labelledby="modalPrintSettingsLabel"
       class="modal fade"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalPrintSettingsLabel"
              class="modal-title fs-5"
          >
            Параметры печати этикетки {{ packingStore.selectedGroupUnregProduct?.key }}
          </h1>
          <button aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
          >
          </button>
        </div>
        <div class="modal-body printer-settings-container"
        >
          <label>Сетевой принтер:</label>
          <select
              v-model="printingStore.selectedPrinter"
              aria-label="Выберите принтер"
              class="form-select"
          >
            <option disabled
                    :value=null
            >
              Выберите принтер...
            </option>
            <option
                v-for="(print, index) in printingStore.printersList?.printers"
                :key="index"
                :value="print"
            >
              {{ print.model }} ({{ print.name }})
            </option>
          </select>
          <label>Тип печати:</label>
          <select v-model="printingStore.selectedLabelTemplate"
                  aria-label="Выберите шаблон этикетки"
                  class="form-select"
          >
            <option disabled
                    :value="null"
            >
              Выберите шаблон этикетки...
            </option>
            <option
                v-for="(label, index) in printingStore.labelTemplatesList"
                :key="index"
                :value="label"
            >
              {{ label.name }}
            </option>
          </select>
          <label>Кол-во этикеток:</label>
          <div class="counter">
            <button @click="printingStore.decrement">&ndash;</button>
            <input v-model.number.trim="printingStore.quantityLabel"
                   min="1"
                   v-on:keypress="useNumbersOnlyWithoutDot"
            />
            <button @click="printingStore.increment">+</button>
          </div>
          <!--          <label>Статус: печати:</label>-->
          <!--          <div v-if="printingStore.printStatus?.status"-->
          <!--               :style="'color: green;'"-->
          <!--          >-->
          <!--            Печатает...-->
          <!--          </div>-->
          <!--          <div v-else>Ожидает задание на печать</div>-->
          <div>
            <div>
              <button class="btn btn-outline-info"
                      data-bs-target="#modalPreviewPrintingBody"
                      data-bs-toggle="modal"
                      type="button"
                      @click="handlePreviewPrint()"
              >
                Просмотр
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  type="button"
          >
            Отменить
          </button>
          <button class="btn btn-outline-success"
                  type="button"
                  @click="handlePrint(packingStore.selectedGroupUnregProduct.data)"
          >
            Печать
          </button>
        </div>
      </div>
    </div>
  </div>
  <ModalPreviewPrintingBody/>
</template>
<script setup>
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useNumbersOnlyWithoutDot} from "@/composables/NumbersOnlyWithoutDot.js";
import ModalPreviewPrintingBody from "@/components/Modals/ModalPreviewPrintingBody.vue";

const warehouseStore = useWarehouseStore()
const packingStore = usePackingStore()
const printingStore = usePrintingStore()
const handlePrint = async (productData) => {
  try {
    await printingStore.PRINT_LABEL(productData)
  } catch (error) {
    console.error('Ошибка при печати:', error);
  }
}
const handlePreviewPrint = () => {
}
</script>
<style scoped>
.printer-settings-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: min-content;
  align-items: center;
  row-gap: 1rem;
}

.counter {
  display: grid;
  grid-template-columns: minmax(3rem, auto) 1fr minmax(3rem, auto);
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