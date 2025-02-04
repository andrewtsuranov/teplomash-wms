<template>
  <div class="svg-container">
    <div v-if="loading" class="loader">
      <!-- Можно использовать любой спиннер, например, от primevue или свой кастомный -->
      <span class="loading-spinner"></span>
    </div>
    <svg
        v-else
        :height="`${gridTotalHeight}px`"
        :viewBox="`0 0 ${gridTotalWidth} ${gridTotalHeight}`"
        :width="`${gridTotalWidth}px`"
        preserveAspectRatio="xMidYMid slice"
        class="responsive-svg"
    >
      <rect
          v-for="(cell, index) in gridCells"
          :key="index"
          :height="cellHeight"
          :width="cellWidth"
          :x="cell.x"
          :y="cell.y"
          fill="#F2C366"
          stroke="#fff"
          stroke-width="20"
      />
    </svg>
    <svg
        :height="`${gridTotalHeight}px`"
        :viewBox="`0 0 ${gridTotalLength} ${gridTotalHeight}`"
        :width="`${gridTotalLength}px`"
        preserveAspectRatio="xMidYMid slice"
        class="responsive-svg"
    >
      <rect
          v-for="(cell, index) in gridCells"
          :key="index"
          :height="cellHeight"
          :width="cellLength"
          :y="cell.y"
          fill="#F2C366"
          stroke="#fff"
          stroke-width="20"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useERPStore } from "@/stores/HTTP/ERPStore.js";

const ERPStore = useERPStore();
const loading = ref(true);

// Создаем реактивные значения с null начальным состоянием
const rows = ref(null);
const cols = ref(null);
const rowsLength = ref(null);
const gridTotalWidth = ref(null);
const gridTotalHeight = ref(null);
const gridTotalLength = ref(null);

// Используем watchEffect для реактивного обновления данных
watchEffect(() => {
  if (ERPStore.palletTypeByProductId?.[0]) {
    loading.value = true;
    // Добавляем небольшую задержку для стабильности обновления
    setTimeout(() => {
      rows.value = ERPStore.palletTypeByProductId[0].rows_height;
      cols.value = ERPStore.palletTypeByProductId[0].rows_width;
      rowsLength.value = ERPStore.palletTypeByProductId[0].rows_length;
      gridTotalWidth.value = mmToPixels(ERPStore.palletTypeByProductId[0].width);
      gridTotalLength.value = mmToPixels(ERPStore.palletTypeByProductId[0].length);
      gridTotalHeight.value = mmToPixels(ERPStore.palletTypeByProductId[0].height - 145);
      loading.value = false;
    }, 100);
  }
});


const mmToPixels = (mm, dpi = 82) => (mm * dpi) / 25.4;

const cellWidth = computed(() => gridTotalWidth.value / cols.value);
const cellLength = computed(() => gridTotalLength.value / rowsLength.value);
const cellHeight = computed(() => gridTotalHeight.value / rows.value);

const gridCells = computed(() => {
  if (!rows.value || !cols.value) return [];

  const cells = [];
  for (let i = 0; i < rows.value; i++) {
    for (let j = 0; j < cols.value; j++) {
      cells.push({
        x: j * cellWidth.value,
        y: i * cellHeight.value,
      });
    }
  }
  return cells;
});
</script>

<style scoped>
.svg-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  aspect-ratio: auto;
  position: relative;
}

.responsive-svg {
  width: 100%;
  height: 100%;
  display: grid;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>