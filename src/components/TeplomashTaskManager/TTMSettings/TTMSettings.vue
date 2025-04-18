<script setup>
import { useWebSocketStore } from "@/stores/WebSockets/WebSocketStore.js";
import { useTSDStore } from "@/stores/HTTP/TSDStore.js";
import { useUserStore } from "@/stores/HTTP/UserStore.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import MyButton from "@/components/UI/Buttons/MyButton.vue";

const webSocketStore = useWebSocketStore();
const TSDStore = useTSDStore();
const userStore = useUserStore();
const router = useRouter();
const handlerDisconnect = () => {
  webSocketStore.disconnect();
};
// const clearQuery = () => {
//   router.replace({ query: {} });
// };
// onMounted(async () => {
//   try {
//     if (!webSocketStore.isConnected) {
//       await webSocketStore.initWebSocket();
//     }
//     await userStore.GET_USERS();
//     if (TSDStore.selectedTSD) {
//       // await router.push({ name: "TTM-TTMTerminal", query: { id: route.query.id || TSDStore.selectedTSD.id } });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// });
</script>
<template>
  <div class="ttm-settings-container gold-black-block">
    <div class="ttm-setting-panel">
      <div class="ttm-setting-panel-items">
        <span>Статус соединения:</span>
        <span
          :class="[
              'status',
              {
                connected: webSocketStore.isConnected,
                disconnected: !webSocketStore.isConnected,
              },
            ]"
        >{{ webSocketStore.connectionStatus }}
          </span>
      </div>
      <div v-if="webSocketStore.isConnected" class="ttm-setting-panel-items">
        <span>ТСД в сети:</span>
        <span v-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length > 0"
              class="online-users-count"
        >
          {{ TSDStore.onlineTSDList.length }}</span>
        <span v-else-if="webSocketStore.isConnected && TSDStore.onlineTSDList?.length === 0"
              class="none-users-count non-active-color"
        >
          Нет активных ТСД</span>
      </div>
      <div v-if="webSocketStore.reconnectAttempts > 0"
           class="ttm-setting-panel-items"
      >
        <span>Попыток соединения:</span>
        <span class="reconnected-count">{{ webSocketStore.reconnectAttempts }} из 5</span>
      </div>
      <div
        v-if="webSocketStore.reconnectError || webSocketStore.error"
        class="ttm-setting-panel-items"
      >
        <span class="error">Ошибка:</span>
        <span class="error">{{ webSocketStore.error || "Ошибка" }}</span>
      </div>
    </div>
    <div class="ttm-settings-button-group">
      <my-button
        :disabled="webSocketStore.isConnected"
        class="my-btn-connect"
        @click="webSocketStore.initWebSocket"
      >Connect
      </my-button>
      <my-button
        :disabled="!webSocketStore.isConnected"
        class="my-btn-disconnect"
        @click="handlerDisconnect"
      >Disconnect
      </my-button>
    </div>
  </div>
</template>
<style scoped>
.ttm-settings-container {
  border-radius: 10px;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(auto, 1fr) min-content;
  padding: 1rem;
  row-gap: 1rem;
}

.ttm-setting-panel {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: repeat(3, 3rem) auto;
}
.gold-black-block {
  background-color: #0000004a;
  border: 1px solid #605039e0;
}
.ttm-setting-panel-items {
  display: grid;
  font-size: 1.2rem;
  font-weight: bold;
  gap: 1rem;
  grid-template-columns: minmax(auto, 1fr) 1fr;
  grid-template-rows: auto;
}

.ttm-setting-panel-items span {
  font-size: 1.2rem;
}


.non-active-color {
  color: #514d4c;
}

.ttm-settings-button-group {
  column-gap: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.green,
.status.connected,
.my-btn-connect,
.my-btn-connect:hover,
.online-users-count {
  color: #4caf50;
}

.red,
.status.disconnected,
.my-btn-disconnect,
.my-btn-disconnect:hover,
.error {
  color: red;
}

.status,
.error,
.reconnected-count,
.online-users-count,
.none-users-count {
  font-size: 1.1rem;
  font-weight: bold;
}

.my-btn-connect,
.my-btn-disconnect {
  border: 1px solid #605039e0;
  border-radius: 20px;
}

.my-btn-connect:hover,
.my-btn-disconnect:hover {
  background-color: rgba(50, 50, 50, 0.6);
}

@media (max-width: 800px) {
  .ttm-setting-panel-items {
    font-size: 1rem;
  }
}
</style>