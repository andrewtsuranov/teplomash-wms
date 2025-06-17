<script setup>
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";
import { computed, onMounted, watch } from "vue";
import PalletDetails from "../REC/map/PalletDetails.vue";

const storageStore = useStorageStore();


// CSS стили для динамической сетки
const rackGridStyles = computed(() => ({
  gridTemplateRows: `repeat(${storageStore.getZoneDimensions.levels}, 1fr)`
}));

const levelStyles = computed(() => ({
  gridTemplateColumns: `repeat(${storageStore.getZoneDimensions.positions}, 1fr)`
}));


// const selectedRack = computed(() => {
//   return storageStore.racks.find(
//     (rack) => rack.id === storageStore.selectedRack,
//   );
// });
const occupiedPalletsCount = computed(() => {
  if (!storageStore.selectedRack) return 0;
  return storageStore.selectedRack?.cells.reduce((acc, cell) => {
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
  return storageStore.selectedRack?.cells[cell]?.levels[level]?.pallets[pallet]
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
  return storageStore.selectedRack?.cells[cell]?.levels[level]?.pallets[pallet]
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
  storageStore.setSelectedPallet(palletInfo);
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
<template>
  <div v-if="storageStore.selectedRack" class="rack-profile">
    <div v-if="storageStore.isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="rack-grid" :style="rackGridStyles">
      <div v-for="level in storageStore.getZoneDimensions.levels" :key="level" class="level" :style="levelStyles">
        <div v-for="cell in storageStore.getZoneDimensions.positions" :key="cell" class="cell">
<!--          <div-->
<!--            v-for="pallet in storageStore.getZoneDimensions.pallets_per_position"-->
<!--            :key="pallet"-->
<!--            class="pallet"-->
<!--            :class="{-->
<!--              occupied: isPalletOccupied(level - 1, cell - 1, pallet - 1),-->
<!--              selected: isSelectedPallet(level - 1, cell - 1, pallet - 1),-->
<!--            }"-->
<!--            @click="handlePalletClick(level - 1, cell - 1, pallet - 1)"-->
<!--          >-->
<!--            <div-->
<!--              class="pallet-content"-->
<!--              v-if="getPalletContent(level - 1, cell - 1, pallet - 1)"-->
<!--            >-->
<!--              {{ getPalletContent(level - 1, cell - 1, pallet - 1).productId }}-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>
    <div class="rack-info">
      <div class="alert alert-info">
        Стеллаж: #{{ storageStore.selectedRack.id.split('.')[0] }}
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
<style scoped>
.rack-profile {
  display: grid;
  grid-template-columns: 1fr;
  overflow-x: auto;
  background-color: #2623238f;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem 2rem;
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
  grid-template-columns: minmax(auto, 1fr);
  row-gap: .7rem;
  justify-items: center;
}

.level {
  display: grid;
  gap: .8rem;
  transition: all 0.3s ease;
}

.cell {
  display: grid;
  grid-template-columns: minmax(88px, auto);
  grid-template-rows: minmax(auto, 20px);
  /*grid-template-columns: repeat(4, 1fr);*/
  column-gap: .2rem;
  transition: all 0.2s ease;
  border: 1px solid #ced4da;
}

.cell:hover {
  background-color: #3487da;
}

.pallet {
  border: 1px solid #ced4da;
  cursor: pointer;
  transition: all 0.2s ease;
  display: grid;
  grid-template-columns: minmax(auto, 20px);
  grid-template-rows: minmax(auto, 20px);
  font-size: .7rem;
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
