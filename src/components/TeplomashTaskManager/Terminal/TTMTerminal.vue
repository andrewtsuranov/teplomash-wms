<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd"> {{ getDeviceById?.username }}</div>
    <div class="ttm-terminal-view">
      <div
          v-if="transactionStore.currentTransactions.length > 0 && transactionStore.lastTransaction?.assigned_to_id === getDeviceById?.id"
          class="ttm-terminal-view-status">
        <span>Задача:</span>
        <div>
          {{ transactionTaskTranslated.toUpperCase() }}
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
        <div :style="{ color: transactionColor}" style="font-weight: bold">
          {{ transactionStatusTranslated }}
        </div>
        <span>Создано:</span>
        <div>
          {{ formatTimestamp(transactionStore.lastTransaction?.timestamp).date }}
          {{ formatTimestamp(transactionStore.lastTransaction?.timestamp).time }}
        </div>
        <span v-if="transactionError">Ошибка:</span>
        <div v-if="transactionError">
          {{transactionError}}
        </div>
      </div>
      <div v-else>
        Нет транзакций
      </div>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/WebSocketStore.js'
import {useTransactionStore} from "@/stores/WebSockets/transactionStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useRoute} from "vue-router";
import {computed, onMounted, onUnmounted} from "vue";
import {useFormatDate} from "@/composables/Date/useFormatDate.js";
import {useTranslationsDictionary} from "@/composables/Dictionary/useTransactionsDictionary.js";
import {useTransactionsColorDictionary} from "@/composables/Dictionary/useTransactionsColorDictionary.js";

const transactionsColorDictionary = useTransactionsColorDictionary
const translationsDictionary = useTranslationsDictionary
const {formattedDateTime, formatTimestamp} = useFormatDate();
const transactionStore = useTransactionStore()
const route = useRoute()
const userStore = useUserStore()
const packingStore = usePackingStore()
const webSocketStore = useWebSocketStore()
const tsdID = route.query.id
const getDeviceById = computed(() => {
  if (packingStore.selectedTSD !== null) {
    return webSocketStore.onlineDevices.find(device => device.id === packingStore.selectedTSD);
  } else if (tsdID) {
    return webSocketStore.onlineDevices.find(device => device.id === tsdID);
  } else
    return null
})
const foundUserById = computed(() => userStore.getUserById(transactionStore.lastTransaction.created_by_id));
const transactionColor = computed(() => {
  const lastTransaction = transactionStore.lastTransaction;
  return lastTransaction ? transactionsColorDictionary[lastTransaction.status] || 'gray' : 'gray';
})
const transactionStatusTranslated = computed(() => {
  const lastTransaction = transactionStore.lastTransaction;
  return lastTransaction ? translationsDictionary[lastTransaction.status] || lastTransaction.status : '';
})
const transactionTaskTranslated = computed(() => {
  const lastTransaction = transactionStore.lastTransaction;
  return lastTransaction ? translationsDictionary[lastTransaction.transaction_type] || lastTransaction.transaction_type : '';
})
const transactionError = computed(() => {
  return webSocketStore.unknownError ? webSocketStore.unknownError.message : null
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