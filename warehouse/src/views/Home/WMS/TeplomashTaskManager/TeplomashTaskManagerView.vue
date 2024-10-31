<template>
  <div class="teplomash-task-manager-container">
    <label class="ttm-title">Тепломаш&reg; Task Manager : </label>
    <div class="ttm-settings">
      <div class="ttm-setting-panel-isConnected">
        <span>Статус соединения:</span>
        <span
            :class="['status', { 'connected': webSocketStore.isConnected, 'disconnected': !webSocketStore.isConnected }]"
        >{{ webSocketStore.connectionStatus }}
        </span>
        <span v-if="webSocketStore.reconnectError"
              class="error"
        >Ошибка соединения:
        </span>
        <span v-if="webSocketStore.error"
              class="error"
        >{{ webSocketStore.error }}
        </span>
        <span v-if="webSocketStore.reconnectAttempts > 0"
              class="wsSetting-panel-reconnected"
        >Попыток соединения:
        </span>
        <span v-if="webSocketStore.reconnectAttempts > 0"
              class="reconnected-count"
        >{{ webSocketStore.reconnectAttempts }}
        </span>
        <span v-if="webSocketStore.isConnected"
        >Пользователи в сети:
        </span>
        <span v-if="webSocketStore.isConnected"
              class="online-users-count"
        >{{ webSocketStore.onlineUsersCount }}
        </span>
      </div>
      <div class="ttm-settings-button-group">
        <my-button :disabled="webSocketStore.isConnected"
                   @click="webSocketStore.initWebSocket"
                   class="my-btn-connect"
        >Connect
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected"
                   @click="handlerDisconnect"
                   class="my-btn-disconnect"
        >Disconnect
        </my-button>
        <!--        <my-button :disabled="!webSocketStore.isConnected"-->
        <!--                   @click="webSocketStore.createWarehouse"-->
        <!--        >Создать склад-->
        <!--        </my-button>-->
        <!--        <my-button :disabled="!webSocketStore.isConnected"-->
        <!--                   @click="webSocketStore.getWarehouse"-->
        <!--        >Получить склад-->
        <!--        </my-button>-->
        <!--        <my-button :disabled="!webSocketStore.isConnected"-->
        <!--                   @click="webSocketStore.createPallet"-->
        <!--        >Создать паллету-->
        <!--        </my-button>-->
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
          >ТСД №{{ device.id }} ({{ device.email }})
          </router-link>
        </div>
      </div>
    </div>
    <div class="ttm-task">
      <div>
        <router-view v-if="webSocketStore.isConnected"></router-view>
        <div v-else>Нет подключения к сети</div>
        <div v-if="webSocketStore.isConnected && !route.meta.isLoading">Выберите активный ТСД</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/TSDStore.js'
import {RouterView} from "vue-router";
import {useRouter, useRoute} from "vue-router";
import MyButton from "@/components/UI/MyButton.vue"
// import {onMounted, onUnmounted} from "vue";
const webSocketStore = useWebSocketStore()
const router = useRouter()
const route = useRoute()
const handlerDisconnect = () => {
  webSocketStore.disconnect()
  router.push({name: 'wmsIN'})

}
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
      "title title"
      "settings task"
      "tsd task";
  grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr);
  gap: 1.7rem;
}

.ttm-title {
  grid-area: title;
  border: 1px solid #605039e0;
  border-radius: 10px;
  background-color: #0000004a;
  padding: 0.5rem 2rem;
  font-size: 1.7rem;
}

.ttm-settings {
  grid-area: settings;
  display: grid;
  grid-template-columns: minmax(300px, 1fr);
  grid-template-rows: minmax(auto, 1fr);
  align-items: start;
  row-gap: 1rem;
  background-color: #0000004a;
  border: 1px solid #605039e0;
  border-radius: 10px;
  padding: 1rem;
}

.ttm-setting-panel-isConnected {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) 1fr;
  gap: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
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
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
}

.status {
  font-weight: bold;
  font-size: 1.1rem;
}

.status.connected {
  color: #4CAF50;
}

.my-btn-connect {
  color: #4CAF50;
  border: 1px solid #605039e0;
  border-radius: 20px;
}

.my-btn-connect:hover {
  background-color: rgba(50, 50, 50, 0.6);
  color: #4CAF50;
}

.status.disconnected {
  color: red;
}

.my-btn-disconnect {
  color: red;
  border: 1px solid #605039e0;
  border-radius: 20px;
}

.my-btn-disconnect:hover {
  background-color: rgba(50, 50, 50, 0.6);
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
  /*background-color: #4CAF50;*/
  background-color: rgba(50, 50, 50, 0.6);
}

.ttm-tsd-item-name {
  display: grid;
  align-items: center;
  padding: 0 0.7rem;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffffbf;
}

.ttm-task {
  grid-area: task;
  display: grid;
  grid-template-columns: minmax(25rem, 1fr);
  grid-template-rows: minmax(33.1rem, auto);
  border: 1px solid #605039e0;
  background-color: #2623238f;
  border-radius: 10px;
  overflow-y: auto;
  align-items: stretch;
}

a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
}

.teplomash-active-exact-link {
  background-color: rgba(2, 73, 89, 0.6);
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

  .ttm-title {
    font-size: 1.5rem;
  }

  .ttm-setting-panel-isConnected {
    font-size: 1rem;
  }

  .ttm-tsd {
    display: grid;
    grid-template-rows: minmax(10rem, 1fr);
  }
}
</style>