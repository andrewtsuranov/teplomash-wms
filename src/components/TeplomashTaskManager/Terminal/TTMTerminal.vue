<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd">
      {{ deviceUsername }}
    </div>
    <div class="ttm-terminal-view">
      <div v-for="item in deviceLatestTransactions"
           :key="item.id"
           class="ttm-terminal-view-container"
      >
        <div class="ttm-terminal-view-transaction">
          <span>Транзакция:</span>
          <div>#{{ item.id }}</div>
          <span>Задача:</span>
          <div>{{ item.stage_progress.stage_name }}</div>
          <span>Инициатор:</span>
          <div>{{ getUsername(item.created_by_id) }}</div>
          <span>Место сборки:</span>
          <div>{{ getWarehouseInStatus(item.warehouse_id) }}</div>
          <span>Статус выполнение:</span>
          <div :style="{ color: getStatusColor(item.status) }" style="font-weight: bold">
            {{ getStatusText(item.status) }}
          </div>
          <span>Создано:</span>
          <div>
            {{ formatTimestamp(item.timestamp).date }}
            {{ formatTimestamp(item.timestamp).time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/WebSocketStore.js'
import {useTransactionStore} from "@/stores/WebSockets/transactionStore.js"
import {usePackingStore} from "@/stores/HTTP/PackingStore.js"
import {useUserStore} from "@/stores/HTTP/UserStore.js"
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useRoute} from "vue-router"
import {computed, ref} from "vue"
import {useFormatDate} from "@/composables/Date/useFormatDate.js"
import {useTranslationsDictionary} from "@/composables/Dictionary/useTransactionsDictionary.js"
import {useTransactionsColorDictionary} from "@/composables/Dictionary/useTransactionsColorDictionary.js"

const warehouseStore = useWarehouseStore()
const transactionsColorDictionary = useTransactionsColorDictionary
const translationsDictionary = useTranslationsDictionary
const {formatTimestamp} = useFormatDate()
const transactionStore = useTransactionStore()
const route = useRoute()
const userStore = useUserStore()
const packingStore = usePackingStore()
const webSocketStore = useWebSocketStore()
// Кэш для пользователей
const usersCache = ref(new Map())
// Кэш для мест сборки
const warehouseCache = ref(new Map())
// Получаем ID устройства
const deviceId = computed(() => {
  if (packingStore.selectedTSD !== null) {
    return packingStore.selectedTSD
  }
  return route.query.id || null
})
// Получаем устройство
const currentDevice = computed(() => {
  if (!deviceId.value) return null
  return webSocketStore.onlineDevices.find(device => device.id === deviceId.value)
})
// Username устройства
const deviceUsername = computed(() => currentDevice.value?.username)
// Получаем последние транзакции для устройства напрямую из store
const deviceLatestTransactions = computed(() => {
  if (!currentDevice.value?.id) return []
  return transactionStore.getLatestTransactionsByDevice(currentDevice.value.id)
})
// Получение имени пользователя с кэшированием
const getUsername = (userId) => {
  if (!userId) return ''
  if (!usersCache.value.has(userId)) {
    const user = userStore.fullListUsers?.find(user => user.id === userId)
    if (user) {
      usersCache.value.set(userId, user.username)
    }
  }
  return usersCache.value.get(userId) || 'Неизвестный пользователь'
}
// Получение место сборки с кэшированием
const getWarehouseInStatus = (warehouseId) => {
  if (!warehouseId) return ''
  if (!warehouseCache.value.has(warehouseId)) {
    const warehouse = warehouseStore.allWarehouses?.find(warehouse => warehouse.id === warehouseId)
    if (warehouse) {
      warehouseCache.value.set(warehouseId, warehouse.name)
    }
  }
  return warehouseCache.value.get(warehouseId) || 'Неизвестное место'
}
// Получение цвета статуса
const getStatusColor = (status) => {
  return transactionsColorDictionary[status] || 'gray'
}
// Получение текста статуса
const getStatusText = (status) => {
  return translationsDictionary[status] || status
}
</script>
<style scoped>
.ttm-terminal-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
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
</style>