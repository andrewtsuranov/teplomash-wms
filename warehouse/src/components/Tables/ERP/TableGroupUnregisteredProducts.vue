<template>
  <div class="wms-packing-erp-product">
    <div class="wms-packing-erp-data">
      <div>
        <p class="d-inline-flex">
          <button aria-controls="collapseExample"
                  aria-expanded="false"
                  class="btn btn-primary"
                  data-bs-target="#collapseExample"
                  data-bs-toggle="collapse"
                  type="button"
          >
            Выбрать период
          </button>
        </p>
        <div id="collapseExample" class="collapse">
          <datetime-picker/>
        </div>
      </div>
      <svg-erp class="erp-logo"/>
      <div class="in-table-container">
        <table class="table-content table table-dark table-hover">
          <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Изделие</th>
            <th scope="col">Кол-во, шт</th>
            <th scope="col">Действие</th>
            <th scope="col">Печать штрихкода</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in webSocketStore.wsGroupUnregProduct" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.product_type.name }}</td>
            <td>{{ item.items_count }}</td>
            <td>
              <button class="btn btn-outline-success"
                      @click="handleCreatePallet(item.items, item.product_type.pallet_types, item.product_type)"
              >Создать паллету
              </button>
            </td>
            <td>
              <button class="btn btn-outline-primary" data-bs-target="#settingsPrintModal" data-bs-toggle="modal"
                      @click=printingStore.getZPLPrinters()
              >Печать Barcode
              </button>
              <!-- Modal -->
              <div id="settingsPrintModal" aria-hidden="true" aria-labelledby="settingsPrintModal" class="modal fade"
                   data-bs-theme="dark" tabindex="-1">
                <div class="modal-dialog  modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 id="settingsPrintLabel" class="modal-title fs-5">Параметры печати</h1>
                      <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                    </div>
                    <div class="modal-body">
                      <div class="printer-settings-container">
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
                        <select class="form-select">
                          <option>QR код</option>
                          <option disabled>Штрихкод (code-128)</option>
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
                        <div v-else>Ожидание</div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button class="btn btn-outline-secondary"
                              data-bs-dismiss="modal"
                              type="button"
                      >Отменить
                      </button>
                      <button class="btn btn-outline-info"
                              type="button"
                              @click="handPrintingLabel()"
                      >Печать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import DatetimePicker from "@/components/UI/DatetimePicker.vue";
import SvgErp from "@/components/UI/SVG/svgErp.vue";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePrintingStore} from "@/stores/HTTP/Printing/PrintingStore.js";
import {useNumbersOnlyWithoutDot} from "@/composables/NumbersOnlyWithoutDot.js";
import {ref} from "vue";

const count = ref(1)
const webSocketStore = useWebSocketStore()
const printingStore = usePrintingStore()
const handleCreatePallet = async (products, palletType, productName) => {
  const getItemCountByGroup = (palletType[0].rows_length * palletType[0].rows_width * palletType[0].rows_height)
  const barcodes = products.map(obj => obj.barcode)
  const data = {
    "action": "create_pallet",
    "from_user": 40,
    "description": `Создание паллеты ${productName.name}`,
    "loader_id": 4,
    "warehouse_id": 1,
    "data": {
      "zone": "PAC-01",
      "count": 2,
      "to": [],
      "from": [],
      "barcodes": barcodes,
      "palletType": palletType[0].name,
      "productName": productName.name,
      "length": palletType[0].length,
      "abc_class": "A",
      "xyz_class": "X"
    }
  }
  await webSocketStore.createPalletTask(data)
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
    await printingStore.printQRCode('Привет Мир!', 1)
  } catch (error) {
    console.error('Ошибка при печати:', error);
  }
}
</script>
<style scoped>
.wms-packing-erp-data {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: 1fr;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
}

.in-table-container {
  display: grid;
  grid-column: 1 / 3;
  grid-template-columns: minmax(auto, 1fr);
  overflow: auto;
  border-top: 1px solid red;
  max-height: 370px;
}

.wms-packing-erp-product {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 1fr;
}

.erp-logo {
  display: grid;
  grid-template-rows: minmax(auto, 200px);
  justify-items: center;
}

.printer-settings-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) 1fr;
  grid-auto-rows: 1fr;
  align-items: center;
  row-gap: 1rem;
}

.counter {
  display: grid;
  grid-template-columns: minmax(3rem, auto) 1fr minmax(3rem, auto);
  font-size: 1.2rem;
  /*align-items: center;*/
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

@media (max-width: 800px) {
  .wms-packing-erp-data {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }

  .printer-settings-container {
    display: grid;
    grid-template-columns:1fr;
  }
}
</style>