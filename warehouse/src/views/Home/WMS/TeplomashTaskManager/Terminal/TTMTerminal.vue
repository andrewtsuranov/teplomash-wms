<template>
  <div class="ttm-task-container">
    <div class="ttm-task-active-tsd">Выбран: ТСД №{{ route.params.tsd }}</div>
    <div class="ttm-task-terminal">
      <div>
        <h3>Терминал:</h3>
        <!--        <div>{{sendData.user_id}} {{sendData.text}}</div>-->
        <div v-if="webSocketStore.receivedMessage?.from_id">{{ webSocketStore.receivedMessage.from_id }}
          {{ webSocketStore.receivedMessage.message }}
        </div>
      </div>
    </div>
    <div class="ttm-task-confirmed input-group input-group-lg">
      <input v-model="message"
             aria-describedby="button-addon2"
             aria-label="Recipient's username"
             class="form-control"
             placeholder="Отправить сообщение..."
             type="text"
      >
      <button id="button-addon2"
              class="btn btn-dark"
              type="button"
              @click="webSocketStore.sendMessage(message, route.params.tsd)"
      >Отправить
      </button>
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from '@/stores/WebSockets/TSDStore.js'
import {useRoute} from 'vue-router'
import {ref} from "vue";

const webSocketStore = useWebSocketStore()
const route = useRoute()
const message = ref()

</script>
<style scoped>
.ttm-task-container {
  display: grid;
  /*grid-template-rows: minmax(auto, 33.1rem);*/
  grid-template-columns: minmax(25rem, 1fr);
  grid-template-rows: 1fr minmax(auto, 27.1rem) auto;
  /*grid-template-rows: auto 1fr auto;*/
  row-gap: 1.7rem;
  overflow-y: auto;
}

.ttm-task-active-tsd {
  font-size: 1.5rem;
  background-color: #0000004a;
  border-bottom: 1px solid #605039e0;
  padding: 1rem;
  place-content: center;
}

.ttm-task-terminal {
  display: grid;
  padding: 1rem;
  grid-template-columns: 1fr;
  font-size: 1.2rem;
  /*overflow-y: auto;*/
}

.ttm-task-confirmed {
}

@media (max-width: 1024px) {
}
</style>