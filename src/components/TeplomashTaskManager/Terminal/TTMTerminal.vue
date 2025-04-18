<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd">
      Выбран: {{ TSDStore.selectedTSD?.username }}
      <button @click="testGetTransaction()">Тест</button>
    </div>
    <div class="ttm-terminal-view">
      <Transactions />
    </div>
  </div>
</template>
<script setup>
import { useWebSocketStore } from "@/stores/WebSockets/WebSocketStore.js";
import Transactions from "@/components/TeplomashTaskManager/Terminal/Transactions.vue";
import { useTSDStore } from "@/stores/HTTP/TSDStore.js";

const webSocketStore = useWebSocketStore();
const TSDStore = useTSDStore();
const testGetTransaction = async () => {
  try {
    await webSocketStore.GET_TRANSACTION_DATA(3880);
  } catch (e) {}
};
</script>
<style scoped>
.ttm-terminal-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
  row-gap: 1rem;
}

.ttm-terminal-active-tsd {
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
  padding: 0 1rem;
  row-gap: 1rem;
}
</style>
