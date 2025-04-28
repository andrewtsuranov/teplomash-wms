<script setup>
import {useTSDStore} from "@/stores/HTTP/TSDStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {useTransactionStore} from "@/stores/WebSockets/transactionStore.js";
import {useTranslationsDictionary} from "@/composables/Dictionary/useTransactionsDictionary.js";
import {useTransactionsColorDictionary} from "@/composables/Dictionary/useTransactionsColorDictionary.js";
import {useFormatDate} from "@/composables/Date/useFormatDate.js";

const TSDStore = useTSDStore();
const warehouseStore = useWarehouseStore();
const transactionStore = useTransactionStore();
const {formatTimestamp} = useFormatDate();
// Получение цвета статуса
const getStatusColor = (status) => {
  return useTransactionsColorDictionary[status] || "gray";
};
// Получение текста статуса
const getStatusText = (status) => {
  return useTranslationsDictionary[status] || status;
};
</script>
<template>
  <div v-if="transactionStore.getLatestTransactionsByDevice.length > 0" class="transaction-container">
    <div
        v-for="item in transactionStore.getLatestTransactionsByDevice"
        :key="item.id"
        class="transaction-view"
    >
      <div class="transaction">
        <span>Транзакция:</span>
        <div>#{{ item.id }}</div>
        <span>ТСД:</span>
        <div>{{ item.assigned_to_id }}</div>
        <span>Задача:</span>
        <div style="color: #df712d">{{ item.stage_progress.task_name }}</div>
        <span v-if="item.status !== 'COMPLETED'">Текущий этап:</span>
        <div v-if="item.status !== 'COMPLETED'"
             style="color: #4099d2"
        >{{ item.stage_progress.stage_name }}
        </div>
        <span>Склад:</span>
        <div>{{ item.warehouse_id }}</div>
        <span>Статус выполнение:</span>
        <div
            :style="{ color: getStatusColor(item.status) }"
            class="transaction-status"
        >
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
  <div v-else
       class="no-transaction-by-device"
  >
    <label>Нет транзакций</label>
  </div>
</template>
<style scoped>
.transaction-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
  row-gap: 1rem;
}

.transaction-view {
  display: grid;
  padding: 1rem;
  background-color: #46464682;
  border-radius: 10px;
}

.transaction {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: min-content;
  column-gap: 1rem;
}

.transaction-status {
  font-weight: bold;
}

.no-transaction-by-device {
  text-transform: uppercase;
  font-weight: bold;
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  color: #514d4c;
}
</style>
