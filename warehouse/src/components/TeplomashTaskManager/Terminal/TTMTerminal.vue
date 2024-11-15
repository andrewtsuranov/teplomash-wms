<template>
  <div class="ttm-terminal-container">
    <div class="ttm-terminal-active-tsd">Выбран: ТСД №{{ route.params.tsdID}} {{props}}</div>
    <div class="ttm-terminal-view">
      <div class="ttm-terminal-view-content">
        <span>Выберите действие:</span>
        <div v-if="webSocketStore.receivedMessage?.from_id"
        >{{ webSocketStore.receivedMessage.from_id }} {{ webSocketStore.receivedMessage.message }}
        </div>
      </div>
    </div>
    <div class="ttm-terminal-confirmed input-group input-group">
      <input v-model="message"
             aria-describedby="button-addon2"
             aria-label="Recipient's username"
             class="form-control"
             placeholder="Отправить сообщение..."
             type="text"
      >
      <button id="button-addon2"
              class="btn btn-success"
              type="button"
              @click="webSocketStore.sendMessage(message, route.params.tsdID)"
      >Отправить
      </button>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/WebSocketStore.js'
import {useRoute} from 'vue-router'
import {ref} from "vue";

const webSocketStore = useWebSocketStore()
const route = useRoute()
const message = ref()
const props = defineProps({
  tsdName: String
})
console.log(props.tsdName)
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
  /*padding: 1rem;*/
  grid-template-columns: minmax(min-content, 1fr);
  font-size: 1.2rem;
  /*overflow-y: auto;*/
}
.ttm-terminal-view-content {
  padding: 0 1rem;
}


@media (max-width: 800px) {

}
</style>