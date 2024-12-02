<template>
  <div class="wms-packing-erp-data">
    <div class="erp-settings-container">
      <div class="erp-settings-group-btn">
        <button
            class="btn btn-outline-info"
            type="button"
            @click=""
        >
          TEST (Загрузить данные)
        </button>
        <button class="btn btn-outline-info"
                type="button"
                @click="webSocketStore.getTransactionData(400, true, true)"
        >
          TEST (Получить транзакцию)
        </button>
      </div>
      <div class="erp-settings-info">
        <div class="alert alert-secondary m-0" data-bs-theme="dark" role="alert">
          <i class="bi bi-info-circle" style="padding-right: 1rem"></i>
          Данные обновляются в автоматическом режиме с периодичностью один раз в 30 минут!
        </div>
      </div>
    </div>
    <svg-logo-erp class="erp-logo"/>
    <table-group-unregistered-products/>
  </div>
</template>
<script setup>
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import SvgLogoErp from "@/components/UI/SVG/svgLogoErp.vue";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";

const webSocketStore = useWebSocketStore()
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