<template>
  <div class="wms-packing-erp-data">
    <div class="erp-data">
      <div class="erp-alert alert m-0" data-bs-theme="dark" role="alert">
        <i class="bi bi-info-circle erp-alert-logo"></i>
        <span
            class="erp-alert-text">Данные обновляются в автоматическом режиме с периодичностью один раз в 30 минут!</span>
      </div>
      <div class="erp-settings-filter">
        <div class="form-check">
          <input id="flexRadioDefault1"
                 v-model="selectedFilter"
                 class="form-check-input"
                 name="flexRadioDefault"
                 type="radio"
                 value="КЭВ-18П4021Е"
          >
          <label class="form-check-label"
                 for="flexRadioDefault1"
          >
            КЭВ-18П4021Е (TEST Default)
          </label>
        </div>
        <div class="form-check">
          <input
              id="flexRadioDefault2"
              v-model="selectedFilter"
              checked
              class="form-check-input"
              name="flexRadioDefault"
              type="radio"
              value="all"
          >
          <label
              class="form-check-label"
              for="flexRadioDefault2"
          >
            Показать все данные
          </label>
        </div>
      </div>
      <table-group-unregistered-products :filterUnregProductByUser="filterUnregProductByUser"/>
    </div>
    <svg-logo-erp class="erp-logo"/>
    <div class="erp-settings-group-btn">
      <button class="btn btn-outline-info"
              type="button"
              @click="webSocketStore.getUnregisteredItems()"
      >
        TEST (Обновить данные)
      </button>
      <div class="qrcode">
        <label style="text-transform: uppercase">Задача: Собрать паллету</label>
        <div v-html="qrcode"></div>
      </div>
      <!--      <button class="btn btn-outline-info"-->
      <!--              type="button"-->
      <!--              @click="webSocketStore.getTransactionData(400, true, true)"-->
      <!--      >-->
      <!--        TEST (Получить транзакцию)-->
      <!--      </button>-->
      <!--      <button class="btn btn-outline-info"-->
      <!--              type="button"-->
      <!--              @click="handleCheckPallet"-->
      <!--      >-->
      <!--        TEST (Проверить паллету)-->
      <!--      </button>-->
      <!--      <button class="btn btn-outline-info"-->
      <!--              type="button"-->
      <!--              @click="webSocketStore.linkPallet"-->
      <!--      >-->
      <!--        TEST (Связать тип паллеты)-->
      <!--      </button>-->
    </div>
  </div>
</template>
<script setup>
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import SvgLogoErp from "@/components/UI/SVG/svgLogoErp.vue";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {ref, computed, onMounted} from "vue";
import QRCode from 'qrcode'

const warehouseStore = useWarehouseStore()
const ERPStore = useERPStore()
const packingStore = usePackingStore()
const userStore = useUserStore()
const webSocketStore = useWebSocketStore()
const selectedFilter = ref('all')
const qrcode = ref(null)
const filterUnregProductByUser = computed(() => {
  if (!webSocketStore.getUnregisteredProducts) {
    return []
  }
  if (selectedFilter.value === 'КЭВ-18П4021Е') {
    return webSocketStore.getUnregisteredProducts.filter(item => {
      return item.name === selectedFilter.value
    })
  } else {
    return webSocketStore.getUnregisteredProducts
  }
})
// const handleCheckPallet = async () => {
//   const data = {
//     "action": "check_pallet",
//     "from_user": userStore.getUserId,
//     "description": '1. Сканируйте зону нахождения паллеты; 2. Сканируйте QR-код паллеты; 3. Сканируйте любое изделие из паллеты;',
//     "loader_id": packingStore.selectedTSD,
//     "warehouse_id": 1,
//     "data": {
//       "to": [],
//       "from": [],
//       "barcodes": []
//     }
//   }
//   try {
//     await webSocketStore.checkPalletTask(data)
//   } catch (e) {
//     console.log(e)
//   }
// }
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
      from_zone_id: warehouseStore.selectedZone.id,
    }
  }
  return JSON.stringify(data)
}

onMounted(async () => {
  try {
    qrcode.value = await generateQR(taskScanData())
    // if (webSocketStore.isConnected) {
    //   await webSocketStore.getUnregisteredItems()
    // }
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

.erp-alert {
  display: grid;
  grid-template-columns:min-content minmax(auto, 1fr);
  column-gap: .7rem;
  background-color: #0000004a;
  border-color: #605039e0;
}

.erp-alert-logo,
.erp-alert-text {
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