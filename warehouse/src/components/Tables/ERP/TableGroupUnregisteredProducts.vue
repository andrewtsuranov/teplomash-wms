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
            <th scope="col">Печать QR кода</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in webSocketStore.wsGroupUnregProduct" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.product_type.name }}</td>
            <td>{{ item.items_count }}</td>
            <td>
              <button class="btn btn-outline-success"
                      @click="handleCreatePallet(item.items, item.product_type.pallet_types)"
              >Создать паллету
              </button>
            </td>
            <td>
              <button class="btn btn-outline-primary"
                      @click="printingStore.printQRCode('[А]-[2024101600]-[П]-[800]-[КЭВ-9П2021Е]-[Панель из глянцевой нержавеющей стали]-[9]')"
              >QR code
              </button>
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

const webSocketStore = useWebSocketStore()
const printingStore = usePrintingStore()
const handleCreatePallet = async (products, palletType) => {
  const getItemCountByGroup = (palletType[0].rows_length * palletType[0].rows_width * palletType[0].rows_height)
  const barcodes = products.map(obj => obj.barcode)
  const data = {
    "action": "create_pallet",
    "from_user": 40,
    "description": "Создание паллеты",
    "loader_id": 43,
    "warehouse_id": 1,
    "count": getItemCountByGroup,
    "data": {
      "barcodes": barcodes,
      "length": palletType[0].length,
      "abc_class": "A",
      "xyz_class": "X"
    }
  }
  await webSocketStore.createPalletTask(data)
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
}
</style>