<template>
  <div class="wsConnection-container">
    <h3 class="ws-title">Тепломаш&reg; Messenger</h3>
    <div class="wsSettings">
      <div class="wsSetting-panel-isConnected">
        <p>Статус соединения:</p>
        <p :class="['status', { 'connected': webSocketStore.isConnected, 'disconnected': !webSocketStore.isConnected }]">
          {{ webSocketStore.connectionStatus }}
        </p>
        <p v-if="webSocketStore.reconnectError" class="error">Ошибка соединения:</p>
        <p v-if="webSocketStore.error" class="error">{{ webSocketStore.error }}</p>
        <p v-if="webSocketStore.reconnectAttempts > 0" class="wsSetting-panel-reconnected">Попыток соединения:</p>
        <p v-if="webSocketStore.reconnectAttempts > 0" class="reconnected-count">
          {{ webSocketStore.reconnectAttempts }}
        </p>
        <p v-if="webSocketStore.isConnected">Пользователи в сети:</p>
        <p v-if="webSocketStore.isConnected" class="online-users-count">{{ webSocketStore.onlineUsersCount }}</p>
      </div>
      <div class="ws-button-group">
        <my-button :disabled="webSocketStore.isConnected" @click="webSocketStore.initWebSocket">Connect</my-button>
        <my-button :disabled="!webSocketStore.isConnected" @click="webSocketStore.disconnect">Disconnect</my-button>
        <my-button :disabled="!webSocketStore.isConnected" @click="webSocketStore.createWarehouse">Создать склад
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected" @click="webSocketStore.getWarehouse">Получить склад
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected" @click="webSocketStore.createPallet">Создать паллету
        </my-button>
      </div>
    </div>
    <div class="active-device">
      <label v-if="webSocketStore.isConnected">Активные ТСД:</label>
      <label v-else style="color: gray">Нет активных ТСД</label>
      <div v-for="device in webSocketStore.onlineDeviceId"
           class="wsChat-active-device-item"
      >
        <span class="item-name-TSD">ТСД № {{ device.id || 'Нет подключённых ТСД' }} ({{ device.email }})</span>
      </div>
      <div v-for="device in webSocketStore.onlineDeviceId"
           class="wsChat-active-device-item"
      >
        <span class="item-name-TSD">ТСД № {{ device.id || 'Нет подключённых ТСД' }} ({{ device.email }})</span>
      </div>
      <div v-for="device in webSocketStore.onlineDeviceId"
           class="wsChat-active-device-item"
      >
        <span class="item-name-TSD">ТСД № {{ device.id || 'Нет подключённых ТСД' }} ({{ device.email }})</span>
      </div>
      <div v-for="device in webSocketStore.onlineDeviceId"
           class="wsChat-active-device-item"
      >
        <span class="item-name-TSD">ТСД № {{ device.id || 'Нет подключённых ТСД' }} ({{ device.email }})</span>
      </div>
      <div v-for="device in webSocketStore.onlineDeviceId"
           class="wsChat-active-device-item"
      >
        <span class="item-name-TSD">ТСД № {{ device.id || 'Нет подключённых ТСД' }} ({{ device.email }})</span>
      </div>
      <div v-for="device in webSocketStore.onlineDeviceId"
           class="wsChat-active-device-item"
      >
        <span class="item-name-TSD">ТСД № {{ device.id || 'Нет подключённых ТСД' }} ({{ device.email }})</span>
      </div>
    </div>
    <div class="wsChat">
      <div class="wsChat-active-device-field">Chosen active device</div>
      <div class="wsChat-field">
        <div v-if="webSocketStore.lastMessage">
          <h3>Последнее обновление:</h3>
          <div>{{ webSocketStore.lastMessage }}</div>
        </div>
      </div>
      <div class="wsChat-send-message">
        <div class=" input-group">
          <input v-model="wsMessage"
                 aria-describedby="button-addon2"
                 aria-label="Recipient's username"
                 class="form-control"
                 placeholder="Отправить сообщение..."
                 type="text"
          >
          <button id="button-addon2"
                  class="btn btn-outline-success"
                  type="button"
                  @click="webSocketStore.sendMessage(wsMessage, 4)"
          >Отправить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/ws/WebSocketStore.js'
import MyButton from "@/components/UI/MyButton.vue"
import {ref} from "vue";
// import {onMounted, onUnmounted} from "vue";
const webSocketStore = useWebSocketStore()
const wsMessage = ref()
// onMounted(() => {
//   userStore.initWebSocket()
// })
// onUnmounted(() => {
//   userStore.disconnect()
// })
</script>
<style scoped>
.wsConnection-container {
  display: grid;
  grid-template-areas:
      "title title title"
      "settings active chat";
  /*margin: 0 60px;*/
  grid-template-columns: max-content max-content max-content;
  justify-self: center;
  gap: 2rem;
}

.ws-title {
  grid-area: title;
}

.wsSettings {
  grid-area: settings;
  display: grid;
  grid-template-columns: minmax(300px, 1fr);
  row-gap: 10px;
  /*grid-auto-rows: min-content;*/
}

.wsChat {
  grid-area: chat;
  display: grid;
  /*grid-template-rows: minmax(auto, 33.1rem);*/
  grid-template-columns: minmax(min-content, 25rem);
  grid-template-rows: min-content 1fr min-content;
  column-gap: 50px;
  /*align-items: start;*/
  overflow-y: auto;
}

.active-device {
  grid-area: active;
  display: grid;
  grid-auto-rows: minmax(3rem, max-content);
  border: 1px solid #605039e0;
  background-color: #2623238f;
  border-radius: 10px;
  font-size: 1.2rem;
}

.wsChat-active-field {

}

.wsChat-active-device-item {
  display: grid;
  border-bottom: 1px solid #605039e0;
  align-items: center;
  background-color: #0000004a;


}

.wsChat-active-device-item:first-of-type {
  border-top: 1px solid #605039e0;
}

.wsChat-active-device-item:hover {
  cursor: pointer;
  background-color: #4CAF50;
}

.item-name-TSD {
  padding: 0 1rem;
  font-size: 1rem;
  color: #ffffffbf;
}

.wsSetting-panel-isConnected {
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

.ws-button-group {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 20px;
  justify-items: start;
  margin-right: 10px;
}

label {
  display: grid;
  align-items: center;
  color: #4CAF50;
  font-weight: bold;
  padding: 0 1rem;
  /*text-align: center;*/
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

.wsChat-field {
  display: grid;
  grid-template-rows: max-content minmax(20rem, auto) min-content;
  border: 1px solid blanchedalmond;
  border-radius: 10px;
  font-size: 1.2rem;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .wsConnection-container {
    display: grid;
    grid-template-areas:
      "title"
      "settings"
      "active"
      "chat";
    /*column-gap: 20px;*/
    grid-template-columns: 1fr;
  }
}
</style>