<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd"> {{ getDeviceById?.username }}</div>
    <div v-if="getAllTransactionByCreatedUser"
         class="ttm-terminal-view"
    >
      <div v-if="transactionError">
        {{ transactionError }}
      </div>
      <div v-for="item in getAllTransactionByCreatedUser"
           :key="item.id"
           class="ttm-terminal-view-container"
      >
        <div class="ttm-terminal-view-transaction">
          <span>Задача:</span>
          <div>
            {{ item.stage_progress.stage_name }}
          </div>
          <span>Инициатор:</span>
          <div>
            {{ item.created_by_id }} {{getUserById}}
          </div>
          <span>Место сборки:</span>
          <div>
            {{ item.warehouse_id }}
          </div>
          <span>Статус выполнение:</span>
          <div :style="{ color: transactionColorTranslated}" style="font-weight: bold">
            {{ item.status }}
          </div>
          <span>Создано:</span>
          <div>
            {{ formatTimestamp(item.timestamp).date }}
            {{ formatTimestamp(item.timestamp).time }}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Нет транзакций
    </div>
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

const transactionColorTranslated = computed(() =>
    transactionStore.last10Transactions
        ? transactionsColorDictionary[transactionStore.last10Transactions.status]
        || 'gray'
        : 'gray'
)
const transactionStatusTranslated = computed(() =>
    transactionStore.last10Transactions
        ? translationsDictionary[transactionStore.last10Transactions.status]
        || transactionStore.last10Transactions.status
        : ''
)
const transactionTaskTranslated = computed(() =>
    transactionStore.last10Transactions
        ? translationsDictionary[transactionStore.last10Transactions.transaction_type]
        || transactionStore.last10Transactions.transaction_type
        : ''
)
const transactionError = computed(() =>
    webSocketStore.unknownError
        ? webSocketStore.unknownError.message
        : null
)
const getAllTransactionByCreatedUser = computed(() => {
  // Early return для защиты от пустых данных
  if (!transactionStore?.allTransactionsList100?.length) {
    return []
  }
  return transactionStore.allTransactionsList100.reduce((acc, item) => {
    if (item.assigned_to_id === getDeviceById.value.id) {
      acc.push(item)
    }
    return acc
  }, [])
})
const getUserById = computed(() => {
  return (id) => userStore.fullListUsers.value.find(user => user.id === id)
})
</script>
<style scoped>
.ttm-terminal-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr min-content;
  row-gap: 1rem;
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
  row-gap: 1rem;
  overflow-y: auto;
}

.ttm-terminal-view-container {
  display: grid;
  place-self: start;
  padding: 1rem;
  background-color: #46464682;
  border-radius: 10px;
}

.ttm-terminal-view-transaction {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: min-content;
  column-gap: 1rem;
}

@media (max-width: 800px) {
}
</style>