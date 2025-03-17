<template>
  <div id="ModalLinkPallet" aria-hidden="true" aria-labelledby="ModalLinkPalletLabel" class="modal fade" data-bs-theme="dark" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="ModalLinkPalletLabel" class="modal-title">Ошибка в изделии</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body modal-grid">
          <div v-if="errorItem"
               class="modal-grid-msg"
          >
            <p>Название изделия: {{ errorItem.name }}</p>
            <div v-if="errorItem.error && errorItem.error.length">
              <label>Найдены следующие ошибки:</label>
              <ul>
                <li v-for="(err, index) in errorMessages" :key="index">
                  {{ err }}
                </li>
              </ul>
            </div>
            <div>
              <label>Создать тип паллеты</label>

            </div>
          </div>
          <div v-else>
            Информация об ошибке недоступна
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {inject, computed} from 'vue'
import {useErrorCodeDictionary} from "@/composables/Dictionary/useErrorCodeDictionary.js"
// Получаем значение из provide
const errorItem = inject('errorItem', null)
// Преобразуем коды ошибок в читаемые сообщения
const errorMessages = computed(() => {
  if (!errorItem.value?.error) return []
  return errorItem.value.error.map(err => useErrorCodeDictionary[err] || `Неизвестная ошибка (${err})`)
})
</script>
<style scoped>
.modal-grid {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(auto, 1fr);
}
.modal-grid-msg {
  display: grid;

}
</style>