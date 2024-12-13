<template>
  <div class="wms-packing-erp-data">
    <div class="erp-settings-container">
      <div class="erp-settings-group-btn">
        <button
            class="btn btn-outline-info"
            type="button"
            @click="webSocketStore.getUnregisteredItems()"
        >
          TEST (Загрузить данные)
        </button>
        <button class="btn btn-outline-info"
                type="button"
                @click="webSocketStore.getTransactionData(400, true, true)"
        >
          TEST (Получить транзакцию)
        </button>
        <button class="btn btn-outline-info"
                type="button"
                @click="handleCheckPallet"
        >
          TEST (Проверить паллету)
        </button>
        <button class="btn btn-outline-info"
                type="button"
                @click="webSocketStore.updateProductCodes(false)"
        >
          TEST (Обновить коды)
        </button>
      </div>
      <div class="erp-settings-filter">
        <div class="form-check">
          <input id="flexRadioDefault1"
                 v-model="selectedFilter"
                 checked
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
      <div class="erp-settings-info">
        <div class="alert alert-secondary m-0" data-bs-theme="dark" role="alert">
          <i class="bi bi-info-circle" style="padding-right: 1rem"></i>
          Данные обновляются в автоматическом режиме с периодичностью один раз в 30 минут!
        </div>
      </div>
    </div>
    <svg-logo-erp class="erp-logo"/>
    <table-group-unregistered-products :filterUnregProductByUser="filterUnregProductByUser"/>
  </div>
</template>
<script setup>
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import SvgLogoErp from "@/components/UI/SVG/svgLogoErp.vue";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {ref, computed, onMounted} from "vue";

const ERPStore = useERPStore()
const packingStore = usePackingStore()
const userStore = useUserStore()
const webSocketStore = useWebSocketStore()
const selectedFilter = ref('КЭВ-18П4021Е')
const filterUnregProductByUser = computed(() => {
  if (!webSocketStore.wsUnregisteredProducts) {
    return []
  }
  if (selectedFilter.value === 'КЭВ-18П4021Е') {
   return webSocketStore.unregisteredProducts.filter(item => {
      return item.key === selectedFilter.value
    })
  } else {
    return webSocketStore.unregisteredProducts
  }
})
const handleCheckPallet = async () => {
  const data = {
    "action": "check_pallet",
    "from_user": userStore.getUserId,
    "description": '1. Сканируйте зону нахождения паллеты; 2. Сканируйте QR-код паллеты; 3. Сканируйте любое изделие из паллеты;',
    "loader_id": packingStore.selectedTSD,
    "warehouse_id": 1,
    "data": {
      "to": [],
      "from": [],
      "barcodes": []
    }
  }
  try {
    await webSocketStore.checkPalletTask(data)
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => {
  try {
    if (webSocketStore.isConnected) {
      await webSocketStore.getUnregisteredItems()
    }
  } catch (e) {
    console.log("WEBSOCKET НЕ ПОДКЛЮЧЕН" + e)
  }
})
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

.erp-logo {
  display: grid;
  grid-template-rows: minmax(auto, 200px);
  justify-items: center;
}

.erp-settings-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(auto, 1fr);
  padding-bottom: 1rem;
}

.erp-settings-group-btn {
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, max-content));
  grid-template-rows: minmax(auto, 1fr);
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