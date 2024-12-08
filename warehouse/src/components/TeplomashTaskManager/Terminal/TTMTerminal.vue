<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd"> {{ getDeviceById?.username }}</div>
    <div class="ttm-terminal-view">
      <div v-if="transactionStore.currentTransactions.length > 0"
           class="ttm-terminal-view-status">
        <span>Задача:</span>
        <div>
          {{ lastTransactionTaskTranslated.toUpperCase() }}
        </div>
        <span>Инициатор:</span>
        <div>
          {{ foundUserById?.lastName }} {{ foundUserById?.initialsDot }}
        </div>
        <span>Место сборки:</span>
        <div>
          {{ transactionStore.lastTransaction?.warehouse_id }}
        </div>
        <span>Статус выполнение:</span>
        <div :style="{ color: lastTransactionStatusColor }">
          {{ lastTransactionStatusTranslated }}
        </div>
        <span>Создано:</span>
        <div>
          {{ formatTimestamp(transactionStore.lastTransaction?.timestamp).date }}
          {{ formatTimestamp(transactionStore.lastTransaction?.timestamp).time }}
        </div>
      </div>
      <div v-else>
        Нет транзакций
      </div>
    </div>
    <!--    <div class="ttm-terminal-confirmed input-group input-group">-->
    <!--      <input v-model="message"-->
    <!--             aria-describedby="button-addon2"-->
    <!--             aria-label="Recipient's username"-->
    <!--             class="form-control"-->
    <!--             placeholder="Отправить сообщение..."-->
    <!--             type="text"-->
    <!--      >-->
    <!--      <button id="button-addon2"-->
    <!--              class="btn btn-success"-->
    <!--              type="button"-->
    <!--              @click="webSocketStore.sendMessage(message, packingStore.selectedTSD)"-->
    <!--      >Отправить-->
    <!--      </button>-->
    <!--    </div>-->
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/WebSocketStore.js'
import {useTransactionStore} from "@/stores/WebSockets/transactionStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useRoute} from "vue-router";
import {computed} from "vue";
import {useFormatDate} from "@/composables/Date/useFormatDate.js";

const {formattedDateTime, formatTimestamp} = useFormatDate();
const transactionStore = useTransactionStore()
const route = useRoute()
const userStore = useUserStore()
const packingStore = usePackingStore()
const webSocketStore = useWebSocketStore()
const tsdID = route.query.id;
const statusColors = {
  PENDING: '#536AF9',
  IN_PROGRESS: '#ecaf0e',
  CANCELLED: '#e80f0f',
  COMPLETED: '#4CAF50',
}
const statusTranslations = {
  PENDING: 'Ожидает подтверждение',
  IN_PROGRESS: 'В процессе сборки',
  CANCELLED: 'Отменено',
  COMPLETED: 'Завершено',
}
const taskTranslations = {
  ADD_PALLET: 'Собрать паллету',
}
const getDeviceById = computed(() => {
  if (packingStore.selectedTSD !== null) {
    return webSocketStore.onlineDevices.find(device => device.id === packingStore.selectedTSD);
  } else {
    return null;
  }
})
const foundUserById = computed(() => userStore.getUserById(transactionStore.lastTransaction.created_by_id));
const lastTransactionStatusColor = computed(() => {
  const lastTransaction = transactionStore.lastTransaction;
  return lastTransaction ? statusColors[lastTransaction.status] || 'gray' : 'gray';
})
const lastTransactionStatusTranslated = computed(() => {
  const lastTransaction = transactionStore.lastTransaction;
  return lastTransaction ? statusTranslations[lastTransaction.status] || lastTransaction.status : '';
})
const lastTransactionTaskTranslated = computed(() => {
  const lastTransaction = transactionStore.lastTransaction;
  return lastTransaction ? taskTranslations[lastTransaction.transaction_type] || lastTransaction.transaction_type : '';
})
</script>
<style scoped>
.ttm-terminal-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr min-content;
  row-gap: 1rem;
  overflow-y: auto;
}

.ttm-terminal-active-tsd {
  font-size: 1.5rem;
  background-color: #0000004a;
  border-bottom: 1px solid #605039e0;
  padding: 1rem;
  place-content: center;
}

.ttm-terminal-view {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  font-size: 1.2rem;
  padding: 0 1rem;
  /*overflow-y: auto;*/
}

.ttm-terminal-view-status {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: min-content;
  column-gap: 1rem;
}

@media (max-width: 800px) {
}
</style>