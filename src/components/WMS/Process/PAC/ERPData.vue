<template>
  <div class="wms-packing-erp-data">
    <div class="erp-data">
      <div class="erp-update">
        <div class="erp-update-alert alert m-0">
          <i class="bi bi-info-circle erp-update-alert-logo"></i>
          <span class="erp-update-alert-text">
            Данные обновляются в автоматическом режиме каждые 5 минут!
          </span>
        </div>
        <button class="btn btn-outline-info"
                type="button"
                @click="webSocketStore.GET_UNREGISTERED_ITEMS()"
        >
          Ручное обновление
        </button>
      </div>
      <table-group-unregistered-products/>
    </div>
    <svg-logo-erp class="erp-logo"/>
    <div class="erp-settings-group-btn">
      <!--      <button class="btn btn-outline-info"-->
      <!--              type="button"-->
      <!--              @click="webSocketStore.LINK_PALLET"-->
      <!--      >-->
      <!--        TEST (Связать тип паллеты)-->
      <!--      </button>-->
      <div class="qrcode">
        <label style="text-transform: uppercase">Задача: Собрать паллету</label>
        <div v-html="qrcode"></div>
      </div>
      <!--            <button class="btn btn-outline-info"-->
      <!--                    type="button"-->
      <!--                    @click="webSocketStore.GET_TRANSACTION_DATA(3455, true, true)"-->
      <!--            >-->
      <!--              TEST (Получить транзакцию)-->
      <!--            </button>-->
    </div>
  </div>
</template>
<script setup>
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import SvgLogoErp from "@/components/UI/SVG/svgLogoErp.vue";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {ref, onMounted} from "vue";
import QRCode from 'qrcode'

const warehouseStore = useWarehouseStore()
const webSocketStore = useWebSocketStore()
const qrcode = ref(null)
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: 'H',
    quality: 0.3,
    width: 200,
    margin: 1,
    color: {
      dark: "#000",
      light: '#EEE'
    }
  };
  return new Promise((resolve, reject) => {
    QRCode.toString(data, opts, (err, string) => {
      if (err) reject(err);
      resolve(string);
    });
  });
};
const taskScanData = () => {
  const data = {
    task_code: "CREATE_PALLET_WITH_SCAN",
    variables: {
      warehouse_id: warehouseStore.warehouseData.id,
      to_zone_id: warehouseStore.selectedZone.id,
      total: 1,
    }
  }
  return JSON.stringify(data)
}
onMounted(async () => {
  try {
    qrcode.value = await generateQR(taskScanData())
  } catch (e) {
    console.log(e)
  }
})
</script>
<style scoped>
.wms-packing-erp-data {
  display: grid;
  grid: "data logo"
        "data buttons";
  grid-template-columns: 1fr 300px;
  grid-template-rows: min-content 1fr;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
  column-gap: 1.5rem;
}

.erp-data {
  display: grid;
  grid-area: data;
  grid-template-columns: minmax(auto, 1fr);
  grid-auto-rows: min-content;
  row-gap: 1rem;
}

.erp-update {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 2rem;
}

.erp-update-alert {
  display: grid;
  grid-template-columns:min-content minmax(auto, 1fr);
  column-gap: .7rem;
  background-color: #0000004a;
  border-color: #605039e0;
}

.erp-update-alert-logo,
.erp-update-alert-text {
  color: #979797;
  font-size: 1.1rem;
}

.erp-logo {
  display: grid;
  grid-area: logo;
  grid-template-rows: minmax(auto, 200px);
  justify-items: center;
}


.erp-settings-group-btn {
  display: grid;
  grid-area: buttons;
  grid-template-columns: minmax(auto, .8fr);
  grid-template-rows: minmax(auto, 3rem) min-content;
  row-gap: 1rem;
  justify-content: center;
}

.qrcode {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content 1fr;
  row-gap: .5rem;
  justify-items: center;
}

@media (max-width: 800px) {
  .wms-packing-erp-data {
    display: grid;
    grid: "logo"
          "buttons"
          "data";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    row-gap: 1rem;
  }


}
</style>