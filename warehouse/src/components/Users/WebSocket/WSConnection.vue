<template>
  <div class="wsConnection-container">
    <h3 style="margin-bottom: 50px">Тепломаш&reg; Messenger</h3>
    <div class="wsConnection">
      <div class="wsSettings">
        <div class="wsSetting-panel-isConnected">
          <p>Статус соединения:</p>
          <p :class="['status', { 'connected': webSocketStore.isConnected, 'disconnected': !webSocketStore.isConnected }]">
            {{ webSocketStore.connectionStatus }}
          </p>
          <!--          <p v-if="userStore.reconnectError" class="error">Ошибка соединения</p>-->
          <!--          <p v-if="userStore.error" class="error">{{ userStore.error }}</p>-->
          <div v-if="webSocketStore.reconnectAttempts > 0"
               class="wsSetting-panel-reconnected"
          >Попыток соединения:<p class="reconnected-count">{{ webSocketStore.reconnectAttempts }}</p>
          </div>
        </div>
        <div class="wsSettings-panel-online"
             v-if="webSocketStore.isConnected"
        >
          <p>Пользователи в сети:</p>
          <p class="online-users-count">{{ webSocketStore.onlineUsersCount }}</p>
        </div>
        <div class="button-group">
          <my-button @click="webSocketStore.initWebSocket" :disabled="webSocketStore.isConnected">Connect</my-button>
          <my-button @click="webSocketStore.disconnect" :disabled="!webSocketStore.isConnected">Disconnect</my-button>
        </div>
      </div>
      <div class="wsChat">
        <div class="wsChat-field" v-if="webSocketStore.lastMessage">
          <h3>Последнее обновление:</h3>
          <pre>{{ webSocketStore.lastMessage }}</pre>
        </div>
        <div class="input-group mb-3">
          <input type="text"
                 v-model="wsMessage"
                 class="form-control"
                 placeholder="Отправить сообщение..."
                 aria-label="Recipient's username"
                 aria-describedby="button-addon2"
          >
          <button class="btn btn-outline-success"
                  type="button"
                  id="button-addon2"
                  @click="webSocketStore.sendMessage(wsMessage, 3)"
          >Отправить
          </button>
        </div>
        <p>Heartbeat count: {{ webSocketStore.heartBeatTimer }}</p>
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
  padding: 20px;
}

.wsConnection {
  display: grid;
  column-gap: 20px;
  grid-template-columns: 1fr 1fr;
}

.wsSettings {
  display: grid;
  row-gap: 10px;
  grid-auto-rows: min-content;
}

.wsChat {
  display: grid;
}

.wsSetting-panel-isConnected {
  display: grid;
  grid-template-columns: 190px 1fr;
  row-gap: 10px;
  column-gap: 20px;
  grid-auto-rows: minmax(40px, auto);
}

.wsSetting-panel-reconnected {
  display: grid;
  grid-column: span 2;
  column-gap: 20px;
  grid-template-columns: 190px 1fr;
}

.wsSettings-panel-online {
  display: grid;
  grid-template-columns: 190px 1fr;
  column-gap: 20px;
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

.button-group button {
  margin-right: 10px;
}

.button-group button {
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
  grid-auto-rows: min-content minmax(300px, auto);
  border: 1px solid blanchedalmond;
  border-radius: 10px
}

pre {
  /*background-color: #f4f4f4;*/
  /*border-radius: 4px;*/
  overflow-x: auto;
  font-size: 1.2rem;
}
</style>