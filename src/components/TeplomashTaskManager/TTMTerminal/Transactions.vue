<template>
  <div  class="transaction-container">
    <div
      v-for="item in transactionStore.getLatestTransactionsByDevice(TSDStore.selectedTSD.id)"
      :key="item.id"
      class="transaction-view"
    >
      <div class="transaction">
        <span>Транзакция:</span>
        <div>#{{ item.id }}</div>
        <span>Задача:</span>
        <div>{{ item.stage_progress.task_name }}</div>
        <span v-if="item.status !== 'COMPLETED'">Текущий этап:</span>
        <div v-if="item.status !== 'COMPLETED'"
             class="transaction-stage-name"
        >{{ item.stage_progress.stage_name }}</div>
        <span>Инициатор:</span>
        <div>{{ findInitialUsername(item.created_by_id) }}</div>
        <span>Номер ТСД:</span>
        <div>{{ findInitialTSD(item.assigned_to_id) }}</div>
        <span>Место:</span>
        <div>{{ findPlacement(item.warehouse_id) }}</div>
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
</template>
<script setup>
import { useTransactionStore } from "@/stores/WebSockets/transactionStore.js";
import { ref } from "vue";
import { useUserStore } from "@/stores/HTTP/UserStore.js";
import { useWarehouseStore } from "@/stores/HTTP/WarehouseStore.js";
import { useTranslationsDictionary } from "@/composables/Dictionary/useTransactionsDictionary.js";
import { useTransactionsColorDictionary } from "@/composables/Dictionary/useTransactionsColorDictionary.js";
import { useFormatDate } from "@/composables/Date/useFormatDate.js";
import { useTSDStore } from "@/stores/HTTP/TSDStore.js";

const transactionStore = useTransactionStore();
const userStore = useUserStore();
const warehouseStore = useWarehouseStore();
const TSDStore = useTSDStore();
const initialUsersCache = ref(new Map());
const initialPlacementCache = ref(new Map());
const initialTSDCache = ref(new Map());
const { formatTimestamp } = useFormatDate();
// Получение имени пользователя с кэшированием
const findInitialUsername = (userId) => {
  if (!userId) return "";
  // Проверяем, есть ли userId в кэше
  if (!initialUsersCache.value.has(userId)) {
    // Ищем пользователя в userStore.fullListUsers
    const initialUser = userStore.fullListUsers?.find(
      (user) => user.id === userId
    );
    if (initialUser) {
      // Сохраняем username в кэш с ключом userId
      initialUsersCache.value.set(userId, initialUser.username);
    }
  }
  // Возвращаем значение из кэша или 'Неизвестный пользователь', если его нет
  return initialUsersCache.value.get(userId) || "Неизвестный пользователь";
};
// Получение имени ТСД с кэшированием
const findInitialTSD = (TSDId) => {
  if (!TSDId) return "";
  // Проверяем, есть ли TSDId в кэше
  if (!initialTSDCache.value.has(TSDId)) {
    // Ищем ТСД в TSDStore.TSDList
    const initialTSD = TSDStore.TSDList?.find((device) => device.id === TSDId);
    if (initialTSD) {
      // Сохраняем username в кэш с ключом userId
      initialTSDCache.value.set(TSDId, initialTSD.username);
    }
  }
  // Возвращаем значение из кэша или 'Неизвестный ТСД', если его нет
  return initialTSDCache.value.get(TSDId) || "Неизвестный ТСД";
};
// Получение месторасположения с кэшированием
const findPlacement = (warehouseId) => {
  if (!warehouseId) return "";
  // Проверяем, есть ли warehouseId в кэше
  if (!initialPlacementCache.value.has(warehouseId)) {
    // Ищем склад в warehouseStore.allWarehouses
    const initialPlacement = warehouseStore.allWarehouses?.find(
      (warehouse) => warehouse.id === warehouseId
    );
    if (initialPlacement) {
      // Сохраняем name в кэш с ключом warehouseId
      initialPlacementCache.value.set(warehouseId, initialPlacement.name);
    }
  }
  // Возвращаем значение из кэша или 'Неизвестное место', если его нет
  return initialPlacementCache.value.get(warehouseId) || "Неизвестное место";
};
// Получение цвета статуса
const getStatusColor = (status) => {
  return useTransactionsColorDictionary[status] || "gray";
};
// Получение текста статуса
const getStatusText = (status) => {
  return useTranslationsDictionary[status] || status;
};
</script>
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

.transaction-stage-name {
  color: #4099d2;
}

.transaction-status {
  font-weight: bold;
}
</style>
