<template>
  <div class="ttm-task-container">
    <h4>Выбран: ТДС №{{ $route.params.id }}</h4>
    <div class="ttm-task-terminal">
      <div>
        <h3>Последнее обновление:</h3>
        <div>{{ webSocketStore.lastMessage }}</div>
      </div>
    </div>
    <div class="input-group">
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
              @click="webSocketStore.sendMessage(wsMessage, $route.params.id)"
      >Отправить
      </button>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/ws/WebSocketStore.js'
import {ref} from "vue";

const webSocketStore = useWebSocketStore()
const wsMessage = ref()
</script>
<style scoped>
.ttm-task-container{
  display: grid;
  /*grid-template-rows: minmax(auto, 33.1rem);*/
  grid-template-columns: minmax(min-content, 25rem);
  grid-template-rows: min-content 1fr min-content;
  row-gap: 1.7rem;
  overflow-y: auto;
}

.ttm-task-terminal {
  display: grid;
  padding: 1rem;
  grid-template-rows: max-content minmax(20rem, auto) min-content;
  border: 1px solid blanchedalmond;
  border-radius: 10px;
  font-size: 1.2rem;
  overflow-y: auto;
}

@media (max-width: 1024px) {

}
</style>