<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd">Выбран: ТСД № {{ tsdID }}</div>
    <div class="ttm-terminal-view">
        <div class="ttm-terminal-view-status">
        <span>Текущая задача:</span>
        <div v-if="webSocketStore.transactionStatus?.assigned_to === Number(tsdID)"
        >{{ webSocketStore.transactionStatus?.transaction_type }}
        </div>
          <span>Текущая задача:</span>
          <div v-if="webSocketStore.transactionStatus?.assigned_to === Number(tsdID)"
          >{{ webSocketStore.transactionStatus?.status }}
          </div>
        </div>

    </div>
    <!--    <div class="ttm-terminal-confirmed input-group input-group">-->
    <!--      <input v-model="message"-->
    <!--             aria-describedby="button-addon2"-->
    <!--             aria-label="Recipient's username"-->
    <!--             class="form-control"-->
    <!--             placeholder="Отправить сообщение..."-->
    <!--             type="text"-->
    <!--      >-->
    <!--      <button id="button-addon2"-->
    <!--              class="btn btn-success"-->
    <!--              type="button"-->
    <!--              @click="webSocketStore.sendMessage(message, packingStore.selectedTSD)"-->
    <!--      >Отправить-->
    <!--      </button>-->
    <!--    </div>-->
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/WebSocketStore.js'
import {usePackingStore} from "@/stores/HTTP/WMS/PackingStore.js";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";

const userStore = useUserStore()
const packingStore = usePackingStore()
const webSocketStore = useWebSocketStore()
defineProps({
  tsdID: String
})
</script>
<style scoped>
.ttm-terminal-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr min-content;
  row-gap: 1rem;
  overflow-y: auto;
}

.ttm-terminal-active-tsd {
  font-size: 1.5rem;
  background-color: #0000004a;
  border-bottom: 1px solid #605039e0;
  padding: 1rem;
  place-content: center;
}

.ttm-terminal-view {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  font-size: 1.2rem;
  padding: 0 1rem;
  /*overflow-y: auto;*/
}

.ttm-terminal-view-status {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: 1fr;
  column-gap: 1rem;

}

@media (max-width: 800px) {
}
</style>