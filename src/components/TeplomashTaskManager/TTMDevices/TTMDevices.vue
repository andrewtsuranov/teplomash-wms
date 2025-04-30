<script setup>
import {useWebSocketStore} from "@/stores/WebSocketStore.js";
import {useTSDStore} from "@/stores/WMSStores/TSDStore.js";
import {onMounted, watch} from "vue";
import {useUserStore} from "@/stores/WMSStores/UserStore.js";
import {useTransactionStore} from "@/stores/WMSStores/TransactionStore.js";
import router from "@/router/index.js";

const userStore = useUserStore();
const TSDStore = useTSDStore();
const transactionStore = useTransactionStore();
const webSocketStore = useWebSocketStore();
// Функция для обновления статуса is_busy устройств
const updateDeviceBusyStatus = () => {
  // Проверяем, что списки транзакций и устройств доступны и не пусты
  if (!transactionStore.allTransactionsList100?.length || !TSDStore.onlineTSDList?.length) {
    return; // Прерываем выполнение, если данные не загружены или пусты
  }

  TSDStore.onlineTSDList = TSDStore.onlineTSDList.map(device => {
    // Ищем транзакции для устройства
    const transactions = transactionStore.allTransactionsList100.filter(tr => tr.assigned_to_id === device.id);
    const transaction = transactions[0]; // Берем первую транзакцию, если она есть

    if (transaction) {
      // Если транзакция PENDING или IN_PROGRESS, устанавливаем is_busy: true
      if (transaction.status === "PENDING" || transaction.status === "IN_PROGRESS") {
        return { ...device, is_busy: true };
      }
      // Если транзакция COMPLETED или CANCELED, устанавливаем is_busy: false
      if (transaction.status === "COMPLETED" || transaction.status === "CANCELED") {
        return { ...device, is_busy: false };
      }
    }
    // Если транзакции нет или статус не соответствует, устанавливаем is_busy: false
    return { ...device, is_busy: false };
  });
};
// Следим за изменениями в списке онлайн ТСД
watch(
    () => TSDStore.onlineTSDList,
    (newDevice) => {
      // Если есть выбранный ТСД и он отсутствует в новом списке, очищаем его
      if (
          TSDStore.selectedTSD &&
          newDevice &&
          !newDevice.some((device) => device.id === TSDStore.selectedTSD.id)
      ) {
        TSDStore.clear_selectedTSD();
      }
    },
    {deep: true}
);
// Следим за изменениями в списке транзакций
watch(
    () => transactionStore.allTransactionsList100,
    () => {
      updateDeviceBusyStatus();
    },
    {deep: true}
);
const handleSelectedDevices = async (device) => {
  if (!device || !device.name) {
    console.error('Device is invalid or missing name');
    return;
  }
  try {
    await TSDStore.set_selectedTSD(device);
  } catch (error) {
    console.error('Error handling selected device:', error);
  }
};
onMounted(async () => {
  try {
    // Загружаем список пользователей, если он пуст
    if (!userStore.fullListUsers) {
      await userStore.GET_USERS();
    }
    // Проверяем наличие устройств и транзакций
    if (!TSDStore.onlineTSDList?.length || !transactionStore.allTransactionsList100?.length) {
      const unwatch = watch(
          () => ({
            devices: TSDStore.onlineTSDList,
            transactions: transactionStore.allTransactionsList100,
          }),
          ({devices, transactions}) => {
            if (devices?.length && transactions?.length) {
              updateDeviceBusyStatus();
              unwatch(); // Отключаем наблюдатель после первого обновления
            }
          },
          {deep: true}
      );
    } else {
      updateDeviceBusyStatus();
    }
  } catch (e) {
    console.log("Error in onMounted:", e);
  }
});
</script>
<template>
  <div class="ttm-devices-container gold-gray-block">
    <label v-if="!webSocketStore.isConnected" class="ttm-devices-name-offline">
      Нет соединения с ТСД
    </label>
    <div v-else class="ttm-devices-online">
      <label class="ttm-devices-header-online">Активные ТСД:</label>
      <div
          v-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length > 0"
          class="ttm-devices-list-online"
      >
        <div
            v-for="device in TSDStore.onlineTSDList"
            :key="device.id"
            class="ttm-devices-item-online gold-black-block"
        >
          <div
              :class="{ active: TSDStore.selectedTSD?.id === device.id }"
              class="ttm-devices-item-name-online"
              @click="handleSelectedDevices(device)"
          >
            <span class="item-title">{{ device.name }} (ID={{ device.id }})</span>
            <span
                :class="{
                'no-task': !device.is_busy,
                'has-task': device.is_busy
              }"
                class="item-title-status"
            >
              <i v-if="device.is_busy" class="bi bi-circle-fill"></i>
              <i v-else class="bi bi-circle-fill"></i>
              {{ device.is_busy ? "Выполняется задача..." : "Нет задач" }}
            </span>
          </div>
        </div>
      </div>
      <div
          v-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length === 0"
          class="ttm-devices-none-online"
      >
        <label class="ttm-devices-none-item-online non-active-color">Список пуст</label>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ttm-devices-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(auto, 1fr);
  border-radius: 10px;
  font-size: 1.2rem;
}

.ttm-devices-online {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto;
  overflow-y: hidden;
}

.ttm-devices-name-offline {
  color: #514d4c;
  display: grid;
  font-size: 1.5rem;
  font-weight: bold;
  place-items: center;
}

.non-active-color {
  color: #514d4c;
}

.no-task,
.ttm-devices-header-online {
  color: #4caf50;
}

.has-task {
  color: red;
}

.ttm-devices-header-online {
  border-bottom: 1px solid #605039e0;
  font-weight: bold;
  padding: 0.5rem 1rem;
}

.ttm-devices-list-online {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-auto-rows: minmax(3rem, max-content);
  overflow-y: scroll;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.ttm-devices-item-online {
  display: grid;
  align-items: stretch;
}

.ttm-devices-item-online:first-of-type {
  border-top: none;
}

.ttm-devices-item-name-online {
  align-items: center;
  color: #ffffffbf;
  background-color: #0000004a;
  border-bottom: 1px solid #605039e0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 1rem;
}

.ttm-devices-list-online .ttm-devices-item-online:last-child .ttm-devices-item-name-online {
  border-bottom: none;
}

.ttm-devices-item-name-online:hover {
  background-color: rgba(50, 50, 50, 0.6);
  cursor: pointer;
}

.ttm-devices-item-name-online,
.item-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.item-title-status {
  display: grid;
  grid-template-columns: min-content auto;
  align-items: center;
  font-size: 17px;
  column-gap: .5rem;
}

.ttm-devices-none-online {
  display: grid;
  place-items: center;
}

.ttm-devices-none-item-online {
  font-size: 1.5rem;
  font-weight: bold;
}

.ttm-devices-item-name-online.active {
  background-color: rgba(2, 73, 89, 0.6);
}

.gold-gray-block {
  background-color: #2623238f;
  border: 1px solid #605039e0;
}

@media (max-width: 800px) {
  .ttm-devices-container {
    display: grid;
    grid-template-rows: minmax(10rem, 1fr);
  }
}
</style>