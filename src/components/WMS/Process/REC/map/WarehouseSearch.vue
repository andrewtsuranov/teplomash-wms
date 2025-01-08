<template>
  <div class="warehouse-search mb-4">
    <div class="row g-3">
      <div class="col-md-4">
        <input
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Поиск по ID продукта..."
            @input="handleSearch"
        >
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="filterStatus">
          <option value="">Все паллеты</option>
          <option value="occupied">Занятые</option>
          <option value="free">Свободные</option>
        </select>
      </div>
      <div class="col-md-3">
        <button
            class="btn btn-primary"
            @click="handleSearch"
        >
          Найти
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from 'vue'
import {useStorageStore} from "@/stores/HTTP/StorageStore.js";

const storageStore = useStorageStore()
const searchQuery = ref('')
const filterStatus = ref('')
const handleSearch = () => {
  storageStore.searchPallets({
    query: searchQuery.value,
    status: filterStatus.value
  })
}
// Добавим debounce для поиска
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(handleSearch, 300)
})
watch(filterStatus, handleSearch)
</script>