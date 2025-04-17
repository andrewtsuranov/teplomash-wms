<template>
  <div class="teplomash-task-manager-container">
    <label class="ttm-title gold-black-block">Тепломаш&reg; Task Manager : </label>
    <div class="ttm-settings gold-black-block">
      <div class="ttm-setting-panel">
        <div class="ttm-setting-panel-items">
          <span>Статус соединения:</span>
          <span
              :class="['status', { 'connected': webSocketStore.isConnected, 'disconnected': !webSocketStore.isConnected }]"
          >{{ webSocketStore.connectionStatus }}
        </span>
        </div>
        <div v-if="webSocketStore.isConnected"
             class="ttm-setting-panel-items"
        >
          <span>ТСД в сети:</span>
          <span v-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length > 0"
                class="online-users-count"
          >{{ TSDStore.onlineTSDList.length }}
        </span>
          <span v-else-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length === 0"
                class="none-users-count non-active-color"
          >Нет активных ТСД
        </span>
        </div>
        <div v-if="webSocketStore.reconnectAttempts > 0"
             class="ttm-setting-panel-items"
        >
          <span class="wsSetting-panel-reconnected">Попыток соединения:</span>
          <span class="reconnected-count"
          >
            {{ webSocketStore.reconnectAttempts }} из 5
          </span>
        </div>
        <div v-if="webSocketStore.reconnectError || webSocketStore.error"
             class="ttm-setting-panel-items"
        >
          <span class="error">Ошибка:</span>
          <span class="error"
          >
            {{ webSocketStore.error || 'Ошибка' }}
        </span>
        </div>
      </div>
      <div class="ttm-settings-button-group">
        <my-button :disabled="webSocketStore.isConnected"
                   class="my-btn-connect"
                   @click="webSocketStore.initWebSocket"
        >Connect
        </my-button>
        <my-button :disabled="!webSocketStore.isConnected"
                   class="my-btn-disconnect"
                   @click="handlerDisconnect"
        >Disconnect
        </my-button>
      </div>
    </div>
    <div class="ttm-tsd gold-gray-block">
      <label v-if="!webSocketStore.isConnected" class="ttm-tsd-name-offline">Нет соединения с ТСД</label>
      <div v-else class="ttm-tsd-online">
        <label class="ttm-tsd-header-online">Активные ТСД:</label>
        <div v-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length > 0"
             class="ttm-tsd-list-online"
        >
          <div v-for="device in TSDStore.onlineTSDList"
               :key="device.id"
               class="ttm-tsd-item-online gold-black-block"
          >
            <router-link :class="{'active' : TSDStore.selectedTSD?.id === device.id || route.query.id === device.id}"
                         :to="{name: 'TTM-packing', query: {id: device.id }}"
                         class="ttm-tsd-item-name-online"
                         @click="TSDStore.set_selectedTSD(device)"
            >
              <span class="item-title">{{ device.name }} (ID={{device.id}})</span>
<!--              <span :class="{-->
<!--                'no-task': device.current_task === null,-->
<!--                'has-task': device.current_task !== null-->
<!--              }"-->
<!--                    class="item-title"-->
<!--              >-->
<!--                <i v-if="device.current_task === null"-->
<!--                   class="bi bi-circle-fill"-->
<!--                ></i>-->
<!--                <i v-else class="bi bi-circle-fill"></i>-->
<!--                {{ device.current_task?.type ?? 'Доступен' }}-->
<!--              </span>-->
            </router-link>
          </div>
        </div>
        <div v-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length === 0"
             class="ttm-tsd-none-online">
          <label class="ttm-tsd-none-item-online non-active-color">Список пуст</label>
        </div>
      </div>
    </div>
    <div class="ttm-terminal gold-gray-block">
      <div v-if="!webSocketStore.isConnected"
           class="ttm-terminal-name-offline"
      >Терминал
      </div>
      <RouterView v-if="webSocketStore.isConnected && route.query.id"/>
      <div v-if="webSocketStore.isConnected && !route.query.id"
           class="ttm-terminal-name-offline"
      >Выберите активный ТСД
      </div>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/WebSocketStore.js'
import {useTSDStore} from "@/stores/HTTP/TSDStore.js";
import {useRouter, useRoute} from "vue-router";
import {onMounted, watch} from "vue";
import MyButton from "@/components/UI/Buttons/MyButton.vue"
import {useUserStore} from "@/stores/HTTP/UserStore.js";

const TSDStore = useTSDStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const webSocketStore = useWebSocketStore()
const handlerDisconnect = () => {
  webSocketStore.disconnect()
}
const clearQuery = () => {
  router.replace({query: {}})
}
watch(() => TSDStore.onlineTSDList, (newDevice, oldDevice) => {
  console.log(newDevice, oldDevice)
}, { immediate: true })
onMounted(async () => {
  try {
    if(!webSocketStore.isConnected) {
      await webSocketStore.initWebSocket()
    }
    await userStore.GET_USERS()
    if(TSDStore.selectedTSD) {
      await router.push({name: 'TTM-packing', query: {id: route.query.id || TSDStore.selectedTSD.id}})
    }

  }catch (e) {
    console.log(e)
  }
})

</script>
<style scoped>
.teplomash-task-manager-container {
  display: grid;
  grid-template-areas:
      "title title"
      "settings task"
      "tsd task";
  grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr);
  grid-auto-rows: min-content auto 1fr;
  gap: 1rem;
}

.gold-black-block {
  background-color: #0000004a;
  border: 1px solid #605039e0;
}

.gold-gray-block {
  border: 1px solid #605039e0;
  background-color: #2623238f;
}

.ttm-title {
  grid-area: title;
  border-radius: 10px;
  padding: 0.5rem 2rem;
  font-size: 1.7rem;
}

.ttm-settings {
  grid-area: settings;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(200px, 1fr) min-content;
  row-gap: 1rem;
  border-radius: 10px;
  padding: 1rem;
}

.ttm-setting-panel {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: repeat(3, 3rem) auto;
}

.ttm-setting-panel-items {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) 1fr;
  gap: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.ttm-setting-panel-items span {
  font-size: 1.2rem;
}

.wsSetting-panel-reconnected {
  /*display: grid;*/
  /*grid-column: span 2;*/
  /*column-gap: 20px;*/
  /*grid-template-columns: 190px 1fr;*/
}

.non-active-color {
  color: #514D4C;
}

.ttm-settings-button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
}

.green,
.status.connected,
.no-task,
.my-btn-connect,
.my-btn-connect:hover,
.ttm-tsd-header-online,
.online-users-count {
  color: #4CAF50;
}

.red,
.status.disconnected,
.my-btn-disconnect,
.my-btn-disconnect:hover,
.has-task,
.error {
  color: red;
}

.status,
.error,
.ttm-tsd-item-name-online .item-title,
.reconnected-count,
.online-users-count,
.none-users-count {
  font-weight: bold;
  font-size: 1.1rem;
}

.my-btn-connect,
.my-btn-disconnect {
  border: 1px solid #605039e0;
  border-radius: 20px;
}

.my-btn-connect:hover,
.my-btn-disconnect:hover,
.ttm-tsd-item-name-online:hover {
  background-color: rgba(50, 50, 50, 0.6);
}

.ttm-tsd {
  grid-area: tsd;
  display: grid;
  grid-template-rows: minmax(3rem, 1fr);
  border-radius: 10px;
  font-size: 1.2rem;
}

.ttm-tsd-online {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto;
}

.ttm-tsd-name-offline,
.ttm-terminal-name-offline {
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #514D4C;
}

.ttm-tsd-header-online {
  font-weight: bold;
  padding: .5rem 1rem;
  border-bottom: 1px solid #605039e0;
}

.ttm-tsd-list-online {
  display: grid;
  grid-auto-rows: minmax(3rem, max-content);
}

.ttm-tsd-item-online {
  display: grid;
  align-items: stretch;
}

.ttm-tsd-item-online:first-of-type {
  border-top: none;
}

.ttm-tsd-item-name-online {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 1rem;
  color: #ffffffbf;
}

.ttm-tsd-none-online {
  display: grid;
  place-items: center;
}

.ttm-tsd-none-item-online {
  font-size: 1.5rem;
  font-weight: bold;
}

.ttm-terminal {
  grid-area: task;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 33.1rem;
  border-radius: 10px;
}

a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
}

/*.teplomash-active-exact-link {*/
/*  background-color: rgba(2, 73, 89, 0.6);*/
/*}*/
.ttm-tsd-item-name-online.active {
  background-color: rgba(2, 73, 89, 0.6);
}

@media (max-width: 800px) {
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

  .ttm-setting-panel-items {
    font-size: 1rem;
  }

  .ttm-tsd {
    display: grid;
    grid-template-rows: minmax(10rem, 1fr);
  }
}
</style>