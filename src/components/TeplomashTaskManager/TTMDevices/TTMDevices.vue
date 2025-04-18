<script setup>
import { useWebSocketStore } from "@/stores/WebSockets/WebSocketStore.js";
import { useTSDStore } from "@/stores/HTTP/TSDStore.js";
import { watch } from "vue";

const TSDStore = useTSDStore();
const webSocketStore = useWebSocketStore();
</script>
<template>
  <div class="ttm-devices-container gold-gray-block">
    <label v-if="!webSocketStore.isConnected"
           class="ttm-devices-name-offline"
    >
      Нет соединения с ТСД</label
    >
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
            :class="{active:TSDStore.selectedTSD?.id === device.id}"
            class="ttm-devices-item-name-online"
            @click="TSDStore.set_selectedTSD(device)"
          >
              <span class="item-title"
              >{{ device.name }} (ID={{ device.id }})</span
              >
            <!--            <span :class="{-->
            <!--                            'no-task': device.current_task === null,-->
            <!--                            'has-task': device.current_task !== null-->
            <!--                          }"-->
            <!--                  class="item-title"-->
            <!--            >-->
            <!--                            <i v-if="device.current_task === null"-->
            <!--                               class="bi bi-circle-fill"-->
            <!--                            ></i>-->
            <!--                            <i v-else class="bi bi-circle-fill"></i>-->
            <!--                            {{ device.current_task?.type ?? "Доступен" }}-->
            <!--                          </span>-->
          </div>
        </div>
      </div>
      <div
        v-if="
            webSocketStore.isConnected && TSDStore.onlineTSDList?.length === 0
          "
        class="ttm-devices-none-online"
      >
        <label class="ttm-devices-none-item-online non-active-color"
        >Список пуст</label
        >
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