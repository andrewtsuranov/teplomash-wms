<template>
  <div class="pallet-details" v-if="selectedPallet">
    <div class="modal fade show" style="display: block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Информация о паллете</h5>
            <button
              type="button"
              class="btn-close"
              @click="closePalletDetails"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePallet">
              <div class="mb-3">
                <label class="form-label">ID продукта</label>
                <input
                  v-model="palletData.productId"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Количество</label>
                <input
                  v-model.number="palletData.quantity"
                  type="number"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Вес (кг)</label>
                <input
                  v-model.number="palletData.weight"
                  type="number"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Описание</label>
                <textarea
                  v-model="palletData.description"
                  class="form-control"
                ></textarea>
              </div>
              <div class="d-flex justify-content-between">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="storageStore.isLoading"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="removePallet"
                  :disabled="storageStore.isLoading"
                >
                  Удалить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";

const storageStore = useStorageStore();
const selectedPallet = computed(() => storageStore.selectedPallet);
const palletData = ref({
  productId: "",
  quantity: 0,
  weight: 0,
  description: "",
});
const closePalletDetails = () => {
  storageStore.setSelectedPallet(null);
};
const savePallet = async () => {
  try {
    await storageStore.addPallet(
      selectedPallet.value.rackId,
      selectedPallet.value.cellId,
      selectedPallet.value.levelId,
      palletData.value,
    );
    closePalletDetails();
  } catch (error) {
    // Обработка ошибки
    console.error(error);
  }
};
const removePallet = async () => {
  try {
    await storageStore.removePallet(
      selectedPallet.value.id,
      selectedPallet.value.rackId,
    );
    closePalletDetails();
  } catch (error) {
    // Обработка ошибки
    console.error(error);
  }
};
</script>
<style scoped>
.pallet-details {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}
</style>
