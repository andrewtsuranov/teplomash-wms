<template>
  <div>
    <!-- Поле поиска -->
    <input
        v-model="searchQuery"
        class="search-input"
        placeholder="Поиск по названию"
    />
    <div v-if="processedData.length > 0">
      <table>
        <thead>
        <tr>
          <th>Код</th>
          <th>Название</th>
          <th>Количество элементов</th>
          <th>Дата</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <template
            v-for="group in processedData"
            :key="group.product_type.code"
        >
          <!-- Основная строка -->
          <tr>
            <td>{{ group.product_type.code }}</td>
            <td>{{ group.product_type.name }}</td>
            <td>{{ group.items_count }}</td>
            <td>{{ group.earliest_date }}</td>
            <td>
              <button
                  @click="group.expanded.value = !group.expanded.value"
              >
                {{ group.expanded.value ? 'Скрыть' : 'Показать' }} детали
              </button>
            </td>
          </tr>
          <!-- Подтаблица -->
          <tr v-if="group.expanded.value">
            <td colspan="5">
              <table>
                <thead>
                <tr>
                  <th>№</th>
                  <th>Название</th>
                  <th>Штрихкод</th>
                  <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(item, index) in group.items"
                    :key="item.id || index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ group.product_type.name }}</td>
                  <td>{{ item.barcode }}</td>
                  <td>{{ item.created_at }}</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
    <div v-else>
      Нет данных для отображения
    </div>
  </div>
</template>
<script setup>
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useERPStore} from "@/stores/HTTP/WMS/1С/ERPStore.js";
import {computed, ref} from "vue";

const webSocketStore = useWebSocketStore()
const ERPStore = useERPStore()
const searchQuery = ref('')
// Безопасная обработка данных
const processedData = computed(() => {
  const selectedItem = ERPStore.selectedItemUnregisteredProduct
  // Проверяем существование и тип данных
  const data = webSocketStore.wsGroupUnregProduct[selectedItem]
  console.log('Исходные данные:', data) // Отладочный вывод
  // Если data не массив, преобразуем в массив или возвращаем пустой массив
  const dataArray = Array.isArray(data)
      ? data
      : data ? [data] : []
  const filteredData = dataArray.filter(group =>
      group.product_type.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  return filteredData.map(group => ({
    ...group,
    expanded: ref(false),
    itemsCount: group.items?.length || 0
  }))
})
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>