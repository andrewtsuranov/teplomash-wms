<!-- components/SearchResults.vue -->
<template>
  <div class="search-results" v-if="storageStore.searchResults.length">
    <div class="card">
      <div class="card-header">Результаты поиска</div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Стеллаж</th>
                <th>Ячейка</th>
                <th>Ярус</th>
                <th>Паллета</th>
                <th>Продукт</th>
                <th>Количество</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in storageStore.searchResults" :key="result.id">
                <td>{{ result.rackId }}</td>
                <td>{{ result.cellId }}</td>
                <td>{{ result.levelId }}</td>
                <td>{{ result.palletId }}</td>
                <td>{{ result.content.productId }}</td>
                <td>{{ result.content.quantity }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-primary me-2"
                    @click="navigateToPallet(result)"
                  >
                    Показать
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="storageStore.removePallet(result.id, result.rackId)"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";

const storageStore = useStorageStore();
const navigateToPallet = (result) => {
  storageStore.setSelectedRack(result.rackId);
  storageStore.setSelectedPallet({
    rackId: result.rackId,
    level: result.levelId,
    cell: result.cellId,
    pallet: result.palletId,
    content: result.content,
  });
};
</script>
<style scoped>
.search-results {
  margin-top: 20px;
}
</style>
