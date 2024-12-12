<template>
  <!-- <div >-->
  <!--    <button class="btn btn-outline-primary" data-bs-target="#settingsPrintModal" data-bs-toggle="modal"-->
  <!--            @click="handlerPrint(item?.product_type?.code)"-->
  <!--    >Печать Barcode-->
  <!--    </button>-->
  <!--    &lt;!&ndash; Modal Print Settings &ndash;&gt;-->
  <!--    <div id="settingsPrintModal" aria-hidden="true" aria-labelledby="settingsPrintModal" class="modal fade"-->
  <!--         data-bs-theme="dark" tabindex="-1">-->
  <!--      <div class="modal-dialog  modal-dialog-centered">-->
  <!--        <div class="modal-content">-->
  <!--          <div class="modal-header">-->
  <!--            <h1 id="settingsPrintLabel" class="modal-title fs-5">Параметры печати</h1>-->
  <!--            <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>-->
  <!--          </div>-->
  <!--          <div class="modal-body">-->
  <!--            <div class="printer-settings-container">-->
  <!--              <label>Сетевой принтер:</label>-->
  <!--              <div>-->
  <!--                <select-->
  <!--                    v-model="printingStore.selectedPrinter"-->
  <!--                    aria-label="Выберите принтер"-->
  <!--                    class="form-select"-->
  <!--                >-->
  <!--                  <option disabled value="">Выберите принтер...</option>-->
  <!--                  <option-->
  <!--                      v-for="(print, ip) in printingStore.printersList?.printers"-->
  <!--                      :key="ip"-->
  <!--                      :value="print"-->
  <!--                  >-->
  <!--                    {{ print.model }} ({{ print.name }})-->
  <!--                  </option>-->
  <!--                </select>-->
  <!--              </div>-->
  <!--              <label>Тип печати:</label>-->
  <!--              <select v-model="printingStore.selectedLabelTemplate"-->
  <!--                      class="form-select"-->
  <!--              >-->
  <!--                <option disabled value="">Выберите шаблон этикетки...</option>-->
  <!--                <option-->
  <!--                    v-for="(label, id) in printingStore.labelTemplatesList"-->
  <!--                    :key="id"-->
  <!--                    :value="label.code"-->
  <!--                >-->
  <!--                  {{ label.name }}-->
  <!--                </option>-->
  <!--              </select>-->
  <!--              <label>Кол-во этикеток:</label>-->
  <!--              <div class="counter">-->
  <!--                <button @click="decrement">&ndash;</button>-->
  <!--                <input v-model.number.trim="count" min="1" v-on:keypress="useNumbersOnlyWithoutDot"/>-->
  <!--                <button @click="increment">+</button>-->
  <!--              </div>-->
  <!--              <label>Статус: печати:</label>-->
  <!--              <div v-if="printingStore.printStatus?.status" :style="'color: green;' ">Отправлено на печать-->
  <!--              </div>-->
  <!--              <div v-else>Готов к печати</div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="modal-footer">-->
  <!--            <button class="btn btn-outline-secondary"-->
  <!--                    data-bs-dismiss="modal"-->
  <!--                    type="button"-->
  <!--            >-->
  <!--              Отменить-->
  <!--            </button>-->
  <!--            <button class="btn btn-outline-info"-->
  <!--                    type="button"-->
  <!--                    @click="handPrintingLabel()"-->
  <!--            >-->
  <!--              Печать-->
  <!--            </button>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!-- </div>-->
  <div v-if="subTableDataProduct">
    <button class="btn btn-outline-primary" data-bs-target="#settingsPrintModal" data-bs-toggle="modal"
      @click="handlerPrint(item?.product_type?.code)">
      Печать Barcode
    </button>
    <table class="table-content table table-dark table-hover">
      <thead class="table-info">
      <tr>
        <th>№</th>
        <th>Название</th>
        <th>Штрихкод</th>
        <th>Дата</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in subTableDataProduct" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.barcode }}</td>
        <td>{{ useSplitDateByT(item.created_at).date }} {{ useSplitDateByT(item.created_at).time }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    Нет данных для отображения
  </div>
</template>
<script setup>
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useSplitDateByT} from "@/composables/SpliDateByT.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {ref} from "vue";
const printingStore = usePrintingStore()
const count = ref(1)
defineProps({
  subTableDataProduct: Array,
})
const ERPStore = useERPStore()
const handlerPrint = (itemCode) => {
  ERPStore.getItemUnregProductByCode(itemCode)
  printingStore.getZPLPrinters()
  printingStore.getLabelTemplate()
}
const increment = () => {
  count.value++;
}
const decrement = () => {
  if (count.value > 1) {
    count.value--;
  }
}
const handPrintingLabel = async () => {
  try {
    await printingStore.printQRCode(ERPStore.getItemBarcode?.barcode)
  } catch (error) {
    console.error('Ошибка при печати:', error);
  }
}
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

th, td {
  padding: 8px;
  text-align: left;
}
</style>