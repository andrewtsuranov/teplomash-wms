<template>
  <div id="modalPrintSettings"
       aria-hidden="true"
       aria-labelledby="modalPrintSettings"
       class="modal fade"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered"
    >
      <div class="modal-content"
      >
        <div class="modal-header"
        >
          <h1 id="settingsPrintLabel"
              class="modal-title fs-5"
          >
            Параметры печати
          </h1>
          <button aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
          >
          </button>
        </div>
        <div class="modal-body"
        >
          <div class="printer-settings-container"
          >
            <label>Сетевой принтер:</label>
            <div>
              <select
                  v-model="printingStore.selectedPrinter"
                  aria-label="Выберите принтер"
                  class="form-select"
              >
                <option disabled value="">Выберите принтер...</option>
                <option
                    v-for="(print, ip) in printingStore.printersList?.printers"
                    :key="ip"
                    :value="print"
                >
                  {{ print.model }} ({{ print.name }})
                </option>
              </select>
            </div>
            <label>Тип печати:</label>
            <select v-model="printingStore.selectedLabelTemplate"
                    class="form-select"
            >
              <option disabled value="">Выберите шаблон этикетки...</option>
              <option
                  v-for="(label, id) in printingStore.labelTemplatesList"
                  :key="id"
                  :value="label.code"
              >
                {{ label.name }}
              </option>
            </select>
            <label>Кол-во этикеток:</label>
            <div class="counter">
              <button @click="decrement">&ndash;</button>
              <input v-model.number.trim="count" min="1" v-on:keypress="useNumbersOnlyWithoutDot"/>
              <button @click="increment">+</button>
            </div>
            <label>Статус: печати:</label>
            <div v-if="printingStore.printStatus?.status" :style="'color: green;' ">Отправлено на печать
            </div>
            <div v-else>Готов к печати</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  type="button"
          >
            Отменить
          </button>
          <button class="btn btn-outline-info"
                  type="button"
                  @click="handlePrint(packingStore.selectedGroupUnregProduct.data)"
          >
            Печать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {ref} from "vue";

const packingStore = usePackingStore()
const count = ref(1)
const printingStore = usePrintingStore()
const handlePrint = async (productData) => {
  try {
    await printingStore.PRINT_LABEL(productData)
  } catch (error) {
    console.error('Ошибка при печати:', error);
  }
}
const increment = () => {
  count.value++;
}
const decrement = () => {
  if (count.value > 1) {
    count.value--;
  }
}
</script>
<style scoped>
</style>