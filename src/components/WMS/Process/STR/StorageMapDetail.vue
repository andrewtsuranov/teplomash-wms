<template>
  <div v-if="selectedRack" class="rack-profile">
    <div v-if="storageStore.isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="rack-grid">
      <div v-for="level in 7" :key="level" class="level">
        <div v-for="cell in 11" :key="cell" class="cell">
          <div
            v-for="pallet in 4"
            :key="pallet"
            class="pallet"
            :class="{
              occupied: isPalletOccupied(level - 1, cell - 1, pallet - 1),
              selected: isSelectedPallet(level - 1, cell - 1, pallet - 1),
            }"
            @click="handlePalletClick(level - 1, cell - 1, pallet - 1)"
          >
            <div
              class="pallet-content"
              v-if="getPalletContent(level - 1, cell - 1, pallet - 1)"
            >
              {{ getPalletContent(level - 1, cell - 1, pallet - 1).productId }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rack-info">
      <div class="alert alert-info">
        Стеллаж #{{ storageStore.selectedRack }}
        <br />
        Занято паллетомест: {{ occupiedPalletsCount }}
        <br />
        Свободно паллетомест: {{ freePalletsCount }}
      </div>
    </div>
    <Transition name="fade">
      <PalletDetails v-if="storageStore.selectedPallet" />
    </Transition>
  </div>
</template>
<script setup>
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";
import { computed, onMounted, watch } from "vue";
import PalletDetails from "../REC/map/PalletDetails.vue";

const storageStore = useStorageStore();
const selectedRack = computed(() => {
  return storageStore.racks.find(
    (rack) => rack.id === storageStore.selectedRack,
  );
});
const occupiedPalletsCount = computed(() => {
  if (!selectedRack.value) return 0;
  return selectedRack.value.cells.reduce((acc, cell) => {
    return (
      acc +
      cell.levels.reduce((levelAcc, level) => {
        return levelAcc + level.pallets.filter((p) => p.occupied).length;
      }, 0)
    );
  }, 0);
});
const freePalletsCount = computed(() => {
  return 11 * 7 * 4 - occupiedPalletsCount.value;
});
const isPalletOccupied = (level, cell, pallet) => {
  return selectedRack.value?.cells[cell]?.levels[level]?.pallets[pallet]
    ?.occupied;
};
const isSelectedPallet = (level, cell, pallet) => {
  const selectedPallet = storageStore.selectedPallet;
  if (!selectedPallet) return false;
  return (
    selectedPallet.level === level &&
    selectedPallet.cell === cell &&
    selectedPallet.pallet === pallet
  );
};
const getPalletContent = (level, cell, pallet) => {
  return selectedRack.value?.cells[cell]?.levels[level]?.pallets[pallet]
    ?.content;
};
const handlePalletClick = (level, cell, pallet) => {
  const palletInfo = {
    rackId: storageStore.selectedRack,
    level,
    cell,
    pallet,
    content: getPalletContent(level, cell, pallet),
  };
  storageStore.selectPallet(palletInfo);
};
// Загружаем данные при монтировании и при изменении выбранного стеллажа
watch(
  () => storageStore.selectedRack,
  async (newRackId) => {
    if (newRackId) {
      await storageStore.fetchRackData(newRackId);
    }
  },
);
onMounted(async () => {
  if (storageStore.selectedRack) {
    await storageStore.fetchRackData(storageStore.selectedRack);
  }
});
</script>
<style scoped>
.rack-profile {
  display: grid;
  grid-template-columns: 1fr;
  overflow-x: auto;
  /*position: relative;*/
  /*max-width: 1280px;*/
  /*margin-top: 20px;*/
  padding: 20px;
  /*background-color: #1b2040;*/
  transition: all 0.3s ease;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rack-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(7, 1fr);
  gap: 10px;
}

.level {
  display: flex;
  gap: 10px;
  transition: all 0.3s ease;
}

.cell {
  display: flex;
  gap: 2px;
  padding: 2px;
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.cell:hover {
  background-color: #dee2e6;
}

.pallet {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ced4da;
  cursor: pointer;
  transition: all 0.2s ease;
  display: grid;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
}

.pallet:hover {
  transform: scale(1.1);
  z-index: 1;
}

.pallet.occupied {
  background-color: #198754;
  color: white;
}

.pallet.selected {
  border: 2px solid #0d6efd;
  transform: scale(1.1);
  z-index: 2;
}

.pallet-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.rack-info {
  margin-top: 20px;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes highlight {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.highlight {
  animation: highlight 0.3s ease;
}
</style>
