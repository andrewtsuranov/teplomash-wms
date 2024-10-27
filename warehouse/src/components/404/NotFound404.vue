<template>
  <div class="not-found-container">
    <div class="not-found">
      <h1>Ошибка 404! Страница не найдена!</h1>
      <my-button
          class="not-found-btn"
          @click="router.push({name: 'General'})"
      >Вернуться назад
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
  place-items: center;
}

.not-found {
  display: grid;
  grid-template-columns: max-content;
  row-gap: 40px;
}

.not-found-btn {
  justify-self: center;
}
</style>