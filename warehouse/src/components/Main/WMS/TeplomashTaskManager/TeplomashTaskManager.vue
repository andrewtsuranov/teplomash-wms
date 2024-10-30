<template>
  <div class="teplomash-task-manager-container">
    <h3 class="ttm-title">Тепломаш&reg; Task Manager </h3>
    <div class="ttm-settings">
      <div class="ttm-setting-panel-isConnected">
        <p>Статус соединения:</p>
        <p :class="['status', { 'connected': webSocketStore.isConnected, 'disconnected': !webSocketStore.isConnected }]"
        >{{ webSocketStore.connectionStatus }}
        </p>
        <p v-if="webSocketStore.reconnectError"
           class="error"
        >Ошибка соединения:
        </p>
        <p v-if="webSocketStore.error"
           class="error"
        >{{ webSocketStore.error }}
        </p>
        <p v-if="webSocketStore.reconnectAttempts > 0"
           class="wsSetting-panel-reconnected"
        >Попыток соединения:
        </p>
        <p v-if="webSocketStore.reconnectAttempts > 0"
           class="reconnected-count"
        >{{ webSocketStore.reconnectAttempts }}
        </p>
        <p v-if="webSocketStore.isConnected"
        >Пользователи в сети:
        </p>
        <p v-if="webSocketStore.isConnected"
           class="online-users-count"
        >{{ webSocketStore.onlineUsersCount }}
        </p>
      </div>
      <div class="ttm-settings-button-group">
        <my-button :disabled="webSocketStore.isConnected"
                   @click="webSocketStore.initWebSocket"
        >Connect
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected"
                   @click="webSocketStore.disconnect"
        >Disconnect
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected"
                   @click="webSocketStore.createWarehouse"
        >Создать склад
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected"
                   @click="webSocketStore.getWarehouse"
        >Получить склад
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected"
                   @click="webSocketStore.createPallet"
        >Создать паллету
        </my-button>
      </div>
    </div>
    <div class="ttm-tsd">
      <label v-if="!webSocketStore.isConnected" class="ttm-tsd-name-inactive">Нет активных ТСД</label>
      <div v-else class="ttm-tsd-active">
        <label class="ttm-tsd-name-active">Активные ТСД:</label>
        <div v-for="device in webSocketStore.onlineDeviceId"
             v-bind:key="device.id"
             class="ttm-tsd-item-active"
        >
          <router-link :to="{ name: 'taskTsd', params: { id: device.id } }"
                       class="ttm-tsd-item-name"
          >
            <span>ТСД №{{ device.id }} ({{ device.email }})</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="ttm-task">
      <router-view v-if="webSocketStore.isConnected"></router-view>
      <div v-else style="color: gray">Нет сообщений или нет соединения</div>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/ws/WebSocketStore.js'
import {RouterView} from "vue-router";
import MyButton from "@/components/UI/MyButton.vue"
// import {onMounted, onUnmounted} from "vue";
const webSocketStore = useWebSocketStore()
// onMounted(() => {
//   userStore.initWebSocket()
// })
// onUnmounted(() => {
//   userStore.disconnect()
// })
</script>
<style scoped>
.teplomash-task-manager-container {
  display: grid;
  grid-template-areas:
      "title title title"
      "settings tsd task";
  grid-template-columns: max-content max-content max-content;
  justify-self: center;
  gap: 2rem;
}

.ttm-title {
  grid-area: title;
}

.ttm-settings{
  grid-area: settings;
  display: grid;
  grid-template-columns: minmax(300px, 1fr);
  row-gap: 10px;
}

.ttm-setting-panel-isConnected {
  display: grid;
  grid-template-columns: max-content minmax(min-content, 1fr);
  column-gap: 30px;
  grid-auto-rows: minmax(40px, auto);
  font-weight: bold;
  font-size: 1.1rem;
}

.wsSetting-panel-reconnected {
  /*display: grid;*/
  /*grid-column: span 2;*/
  /*column-gap: 20px;*/
  /*grid-template-columns: 190px 1fr;*/
}

.online-users-count {
  font-size: 1.1rem;
  font-weight: bold;
  color: #4CAF50;
}

.reconnected-count {
  font-size: 1.1rem;
  font-weight: bold;
}

.ttm-settings-button-group {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 20px;
  justify-items: start;
  margin-right: 10px;
}

.status {
  font-weight: bold;
  font-size: 1.1rem;
}

.status.connected {
  color: #4CAF50;
}

.status.disconnected {
  color: red;
}

.error {
  font-weight: bold;
  font-size: 1.1rem;
  color: red;
}

.ttm-tsd {
  grid-area: tsd;
  display: grid;
  grid-template-rows: minmax(3rem, 1fr);
  border: 1px solid #605039e0;
  background-color: #2623238f;
  border-radius: 10px;
  font-size: 1.2rem;
}

.ttm-tsd-name-inactive {
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
  color: gray;
  padding: 0 1rem;
}

.ttm-tsd-name-active {
  display: grid;
  align-items: center;
  color: #4CAF50;
  font-weight: bold;
  padding: 0 1rem;
  /*text-align: center;*/
}

.ttm-tsd-active {
  display: grid;
  grid-auto-rows: minmax(3rem, max-content);
}

.ttm-tsd-item-active {
  display: grid;
  border-bottom: 1px solid #605039e0;
  background-color: #0000004a;
  align-items: stretch;
}

.ttm-tsd-item-active:first-of-type {
  border-top: 1px solid #605039e0;
}

.ttm-tsd-item-active:hover {
  cursor: pointer;
  background-color: #4CAF50;
}

.ttm-tsd-item-name {
  display: grid;
  align-items: center;
  padding: 0 0.7rem;
  font-size: 1rem;
  color: #ffffffbf;
}

.ttm-task {
  grid-area: task;
  display: grid;
  align-items: center;
  padding: 1rem;
  grid-template-rows: minmax(20rem, 1fr);
  border: 1px solid #605039e0;
  background-color: #2623238f;
  border-radius: 10px;
  font-size: 1.2rem;
}

a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
}

.teplomash-active-exact-link {
  background-color: #4CAF50;
}

@media (max-width: 1024px) {
  .teplomash-task-manager-container {
    display: grid;
    grid-template-areas:
      "title"
      "settings"
      "tsd"
      "task";
    grid-template-columns: 1fr;
  }

  .ttm-tsd {
    display: grid;
    grid-template-rows: minmax(10rem, 1fr);
  }
}
</style>