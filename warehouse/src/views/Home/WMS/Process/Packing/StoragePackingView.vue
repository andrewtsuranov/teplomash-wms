<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
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
              <th scope="col">Дата</th>
              <th scope="col">Время</th>
              <th scope="col">Действие</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in webSocketStore.wsGroupUnregProduct" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.product_type.name }}</td>
              <td>{{ item.items_count }}</td>
              <td>{{ useSplitDateByT(item.earliest_date).date }}</td>
              <td>{{ useSplitDateByT(item.earliest_date).time }}</td>
              <td>
                <button class="btn btn-success"
                        @click="handleCreatePallet(item.items, item.product_type.pallet_types)"
                >Создать паллету
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <TeplomashTaskManagerView/>
    <div class="wms-packing-pallet">
      <div v-for="n in 7" :key="n" class="pallet-item-content">
        <div class="pallet-item-row-one">
          <span>Зона:{{ packingStore.palletData.zoneStorage }}</span>
          <span>Паллета №{{ n }}</span>
          <span>Дата создания:{{ dataYYYYMMDD }}</span>
        </div>
        <div class="pallet-item-row-two">
          <svg-eur-one100-mini841/>
        </div>
        <div class="pallet-item-row-three">
          <div class="in-table-item-container">
            <table class="table-content table table-dark table-hover">
              <thead>
              <tr>
                <th scope="col">№</th>
                <th scope="col">Изделие</th>
                <th scope="col">Кол-во, шт</th>
                <th scope="col">Barcode</th>
                <th scope="col">Дата выпуска</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in webSocketStore.wsGroupUnregProduct" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>КЭВ-2П1123Е</td>
                <td>1</td>
                <td>{{ item.items[0].barcode }}</td>
                <td>{{ useSplitDateByT(item.items[0].created_at).date }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div>
      <router-view name="TTM"/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import QRCode from 'qrcode'
import {useERPStore} from "@/stores/HTTP/WMS/1С/ERPStore.js";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePackingStore} from "@/stores/HTTP/WMS/PackingStore.js";
import TeplomashTaskManagerView from "@/components/TeplomashTaskManager/TeplomashTaskManagerView.vue";
import DatetimePicker from "@/components/UI/DatetimePicker.vue";
import SvgEurOne100Mini841 from "@/components/UI/SVG/svgEurOne100Mini841.vue";
import {useSplitDateByT} from "@/composables/SpliDateByT.js";
import SvgErp from "@/components/UI/SVG/svgErp.vue";

const packingStore = usePackingStore()
const ERPStore = useERPStore()
const userStore = useUserStore()
const webSocketStore = useWebSocketStore()
onMounted(async () => {
  await generateQR(text.value)
})
const text = ref('[А]-[2024101600]-[П]-[800]-[КЭВ-9П2021Е]-[Панель из глянцевой нержавеющей стали]-[9]')
const qrcode = ref(null)
const dataYYYYMMDD = ref(new Date().toISOString().slice(0, 10));
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: 'H',
    quality: 0.3,
    width: 130,
    margin: 1,
    color: {
      dark: "#000",
      light: '#EEE'
    }
  }
  await QRCode.toString(data, opts, (err, string) => {
    if (err) throw err
    qrcode.value = string
  })
}
const handleCreatePallet = async (products, palletType) => {
  const barcodes = products.map(obj => obj.barcode)
  const data = {
    "action": "create_pallet",
    "from_user": 40,
    "loader_id": 4,
    "warehouse_id": 1,
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
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 1rem;
}

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

.in-table-item-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  overflow: auto;
  border-top: 1px solid red;
  max-height: 250px;
}

.table-content {

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


.wms-packing-pallet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
}

.pallet-item-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  /*border: 2px solid #4CAF50;*/
  border: 2px solid #E8B53F;
  /*border: 2px solid #B01010;*/
  padding: 1rem;
  row-gap: .5rem;
  border-radius: 1rem;
  min-height: 400px;
}

.pallet-item-row-one {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.pallet-item-row-two {
  padding: 1rem;
}

.pallet-qrcode {
  grid-area: qrcode;
  align-self: end;
}

.pallet-status {
  grid-area: status;
  padding: .5rem 0;
  border-top: 1px solid red;
  font-size: 1.3rem;
}


@media (max-width: 800px) {
  .wms-packing-erp-data {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .wms-packing-pallet {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }


}
</style>