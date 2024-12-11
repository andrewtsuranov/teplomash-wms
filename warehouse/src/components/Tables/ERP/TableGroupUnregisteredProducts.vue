<template>
  <div class="in-table-container">
    <table class="table-content table table-dark table-hover">
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Изделие</th>
        <th scope="col">Кол-во, шт</th>
        <th scope="col">Пунк назначения</th>
        <th scope="col">Задача</th>
        <th scope="col">Печать штрихкода</th>
        <th scope="col">Дополнительно</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(item, key) in ERPStore.unregisteredProducts" :key="key">
        <tr>
          <th scope="row">{{ item.number }}</th>
          <td data-bs-target="#modalDetailUnregisteredProduct" data-bs-toggle="modal">
            {{ item.key }}
          </td>
          <td>{{ item.data.length }}</td>
          <td>
            <select class="form-select" aria-label="Default select example">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline-success"
                    @click="handleCreatePallet(item)"
            >Собрать паллету
            </button>
          </td>
          <td>
            <button class="btn btn-outline-primary" data-bs-target="#settingsPrintModal" data-bs-toggle="modal"
                    @click="handlerPrint(item?.product_type?.code)"
            >Печать Barcode
            </button>
            <!-- Modal Print Settings -->
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
                      <select class="form-select"
                              v-model="printingStore.selectedLabelTemplate"
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
                            @click="handPrintingLabel()"
                    >
                      Печать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <button class="btn btn-outline-primary"
                    @click="toggleTable(item?.product_type?.code);"
            >
              {{ openedItemCode === item?.product_type?.code ? 'Скрыть список' : 'Раскрыть список' }}
            </button>
          </td>
        </tr>
        <!-- Подтаблица, отображаемая при раскрытии списка -->
        <tr v-if="openedItemCode === item?.product_type?.code" :key="'subtable-' + item?.product_type?.code">
          <td colspan="6">
            <table-item-unregistered-product/>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {useNumbersOnlyWithoutDot} from "@/composables/NumbersOnlyWithoutDot.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {ref, computed} from "vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";

defineProps({
  filter: Object
})
const warehouseStore = useWarehouseStore()
const userStore = useUserStore()
const ERPStore = useERPStore()
const webSocketStore = useWebSocketStore()
const packingStore = usePackingStore()
const printingStore = usePrintingStore()
// const loading = computed(() => webSocketStore.loading)
const count = ref(1)
const openedItemCode = ref(null);
const handleCreatePallet = async (products) => {
  try {
    await ERPStore.GET_PALLET_TYPE_BY_PRODUCT_ID(products.data[0].product_type)
    const data = {
      "action": "create_pallet",
      "from_user": userStore.getUserId,
      "description": `Создание паллеты ${products.key}`,
      "loader_id": packingStore.selectedTSD,
      "warehouse_id": warehouseStore.getWarehouseId,
      "data": {
        "to_zone_id": "REC-01",
        "from_zone_id": 'warehouseStore.',
        "count": products.data.length,
        "to": [],
        "from": [],
        "barcodes": products.data.map(data => data.barcode),
        "palletType": ERPStore.palletTypeByProductId[0]?.id || [],
        "abc_class": "A",
        "xyz_class": "X"
      }
    }
    await webSocketStore.createPalletTask(data)
  } catch (e) {
    console.log(e)
  }
}
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
    await printingStore.printQRCode(ERPStore.getItemBarcode.barcode)
  } catch (error) {
    console.error('Ошибка при печати:', error);
  }
}
const toggleTable = (itemCode) => {
  if (openedItemCode.value === itemCode) {
    openedItemCode.value = null;
  } else {
    openedItemCode.value = itemCode;
    ERPStore.getItemUnregProductByCode(itemCode);
  }
};
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

table thead {
  position: sticky;
  top: 0;
  z-index: 10;
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

.erp-settings-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(auto, 1fr);
  padding-bottom: 1rem;
}

.erp-settings-group-btn {
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, max-content));
  grid-template-rows: minmax(auto, 50px);
  column-gap: 2rem;
}

.erp-settings-info {
  display: grid;
  grid-auto-columns: max-content;
  grid-template-rows: min-content;
  column-gap: 2rem;
  align-content: end;
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

  .erp-settings-container {
    row-gap: 1rem;
  }

  .erp-settings-group-btn {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(auto, 50px);
    row-gap: 1.2rem;
  }

  .erp-settings-info {
    display: grid;
    grid-auto-columns: minmax(auto, 1fr);
  }
}
</style>