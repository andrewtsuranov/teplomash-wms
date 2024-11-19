<template>
  <div class="not-found-container">
    <div class="not-found">
      <h1>Ошибка 404! Страница не найдена!</h1>
      <my-button
          class="not-found-btn"
          @click="router.push('/')"
      >Вернуться домой
      </my-button>
    </div>
  </div>
</template>
<script setup>
import MyButton from '@/components/UI/MyButton.vue'
import {useRouter} from "vue-router";

const router = useRouter()
</script>
<style scoped>
.not-found-container {
  display: grid;
  grid-template-columns: minmax(min-content, auto);
  grid-template-rows: 1fr;
  justify-content: center;
  height: 100%;
  /*grid-template-columns: minmax(min-content, auto);*/
}

.not-found {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  /*grid-template-columns: minmax(min-content, auto);*/
  row-gap: 40px;
}

.not-found-btn {
  justify-self: center;
}

@media (max-width: 1024px) {
  .not-found {
    padding: 0 20px;
    text-align: center;
  }
}
</style>