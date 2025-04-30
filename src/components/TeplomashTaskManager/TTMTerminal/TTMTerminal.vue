<script setup>
import {useWebSocketStore} from "@/stores/WebSocketStore.js";
import {useTSDStore} from "@/stores/WMSStores/TSDStore.js";
import Transactions from "@/components/TeplomashTaskManager/TTMTerminal/Transactions.vue"

const webSocketStore = useWebSocketStore()
const TSDStore = useTSDStore();
const testGetTransaction = async (id) => {
  try {
    await webSocketStore.GET_TRANSACTION_DATA(id);
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <div class="ttm-terminal-container gold-gray-block">
    <div v-if="!webSocketStore.isConnected"
         class="ttm-terminal-name-offline"
    >
      Терминал
    </div>
    <div
        v-else-if="!TSDStore.selectedTSD"
        class="ttm-terminal-name-offline"
    >
      Выберите активный ТСД
    </div>
    <div v-else
         class="ttm-terminal-active"
    >
      <div class="ttm-terminal-active-devices">
        Выбран: {{ TSDStore.selectedTSD?.name }}
        <button78 @click="testGetTransaction(3880)">Тест</button78>
      </div>
      <Transactions class="ttm-terminal-view"/>
    </div>
  </div>
</template>
<style scoped>
.ttm-terminal-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  border-radius: 10px;
}

.ttm-terminal-active {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto;
  overflow-y: hidden;
}

.ttm-terminal-active-devices {
  background-color: #0000004a;
  border-bottom: 1px solid #605039e0;
  font-size: 1.5rem;
  padding: 1rem;
  place-content: center;
}

.ttm-terminal-view {
  display: grid;
  font-size: 1.2rem;
  grid-template-columns: minmax(auto, 1fr);
  overflow-y: auto;
  padding: 1rem;
  row-gap: 1rem;
}

.ttm-terminal-name-offline {
  color: #514d4c;
  display: grid;
  font-size: 1.5rem;
  font-weight: bold;
  place-items: center;
}

.gold-gray-block {
  background-color: #2623238f;
  border: 1px solid #605039e0;
}
</style>
