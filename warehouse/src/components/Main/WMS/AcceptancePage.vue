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
    <div class="wsChat">
      <div v-if="webSocketStore.lastMessage" class="wsChat-field">
        <h3>Последнее обновление:</h3>
        <div>{{ webSocketStore.lastMessage }}</div>
      </div>
      <div class="input-group mb-3">
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
      "title title"
      "settings chat";
  /*margin: 0 60px;*/
  grid-template-columns: 1fr 1fr;
  row-gap: 30px;
}

.ws-title {
  grid-area: title;
}

.wsSettings {
  grid-area: settings;
  display: grid;
  grid-template-columns: minmax(300px, 1fr);
  row-gap: 10px;
  grid-auto-rows: min-content;
}

.wsChat {
  grid-area: chat;
  display: grid;
  grid-template-columns: minmax(300px, 1fr);
  row-gap: 20px;
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

.wsSettings-panel-online {
  /*display: grid;*/
  /*grid-template-columns: 190px 1fr;*/
  /*column-gap: 20px;*/
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

.status {
  font-weight: bold;
  font-size: 1.1rem;
}

.status.connected {
  color: green;
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
  padding: 20px;
  grid-template-rows: min-content minmax(300px, auto);
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
      "chat";
    /*column-gap: 20px;*/
    grid-template-columns: 1fr;
  }
}
</style>