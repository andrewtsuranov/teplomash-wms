<template>
  <div class="svg-container">
      <svg
          :height="`${gridTotalHeight}px`"
          :viewBox="`0 0 ${gridTotalWidth} ${gridTotalHeight}`"
          :width="`${gridTotalWidth}px`"
          preserveAspectRatio="xMidYMid slice"

      >
        <rect
            v-for="(cell, index) in gridCells"
            :key="index"
            :height="cellHeight"
            :width="cellWidth"
            :x="cell.x"
            :y="cell.y"
            fill="#F2C366"
            stroke="#000"
            stroke-width="1"
        />
      </svg>
      <svg
           preserveAspectRatio="xMidYMid slice"
           viewBox="0 0 42.49 5.1"
           class="responsive-svg"
      >
        <path class="fil0" d="M0 4.41l5.84 0 0 -3.02 -5.84 0 0 3.02z"/>
        <path class="fil1" d="M0 1.39c0.09,0 5.84,0 5.84,0l0 0.53 -5.84 -0.38 0 -0.15z"/>
        <path class="fil2" d="M1.19 4.41l4.65 0 0 -2.01c0,0 -0.07,0.29 -1.46,1.15 -1.39,0.86 -3.19,0.86 -3.19,0.86z"/>
        <path class="fil3"
              d="M0.73 3.84c-0.01,0 -0.02,-0.01 -0.02,-0.01 -0.14,-0.01 -0.2,-0.14 -0.22,-0.25 -0.11,-0.25 -0.1,-0.56 -0.11,-0.82 -0.01,-0.22 -0.11,-0.61 0.01,-0.81 0.05,-0.09 0.16,-0.11 0.27,-0.11 0.1,0 0.21,0.02 0.3,0.02 0.36,0.01 0.72,0.01 1.09,0.01 0.07,0.01 0.16,0.01 0.22,0.05 0.05,0.03 0.07,0.07 0.08,0.11 0.08,0.25 -0.14,0.49 -0.39,0.64 -0.25,0.16 -0.54,0.27 -0.72,0.48 -0.12,0.13 -0.18,0.3 -0.25,0.46 -0.05,0.1 -0.13,0.23 -0.26,0.23z"/>
        <path class="fil0" d="M18.33 4.41l5.84 0 0 -3.02 -5.84 0 0 3.02z"/>
        <path class="fil1" d="M18.33 1.39c0.09,0 5.84,0 5.84,0l0 0.53 -5.84 -0.38 0 -0.15z"/>
        <path class="fil2" d="M19.51 4.41l4.66 0 0 -2.01c0,0 -0.07,0.29 -1.46,1.15 -1.39,0.86 -3.2,0.86 -3.2,0.86z"/>
        <path class="fil3"
              d="M19.05 3.84c-0.01,0 -0.01,-0.01 -0.02,-0.01 -0.13,-0.01 -0.19,-0.14 -0.22,-0.25 -0.1,-0.25 -0.09,-0.56 -0.11,-0.82 -0.01,-0.22 -0.1,-0.61 0.02,-0.81 0.05,-0.09 0.15,-0.11 0.27,-0.11 0.1,0 0.21,0.02 0.29,0.02 0.37,0.01 0.73,0.01 1.09,0.01 0.08,0.01 0.17,0.01 0.23,0.05 0.04,0.03 0.07,0.07 0.08,0.11 0.07,0.25 -0.15,0.49 -0.39,0.64 -0.25,0.16 -0.55,0.27 -0.73,0.48 -0.12,0.13 -0.18,0.3 -0.24,0.46 -0.05,0.1 -0.14,0.23 -0.27,0.23z"/>
        <path class="fil0" d="M36.65 4.41l5.84 0 0 -3.02 -5.84 0 0 3.02z"/>
        <path class="fil1" d="M36.65 1.39c0.09,0 5.84,0 5.84,0l0 0.53 -5.84 -0.38 0 -0.15z"/>
        <path class="fil2" d="M37.84 4.41l4.65 0 0 -2.01c0,0 -0.07,0.29 -1.46,1.15 -1.39,0.86 -3.19,0.86 -3.19,0.86z"/>
        <path class="fil3"
              d="M37.38 3.84c-0.01,0 -0.02,-0.01 -0.02,-0.01 -0.14,-0.01 -0.2,-0.14 -0.22,-0.25 -0.11,-0.25 -0.1,-0.56 -0.11,-0.82 -0.01,-0.22 -0.11,-0.61 0.01,-0.81 0.05,-0.09 0.16,-0.11 0.27,-0.11 0.1,0 0.21,0.02 0.3,0.02 0.36,0.01 0.72,0.01 1.09,0.01 0.08,0.01 0.16,0.01 0.22,0.05 0.05,0.03 0.07,0.07 0.09,0.11 0.07,0.25 -0.15,0.49 -0.4,0.64 -0.25,0.16 -0.54,0.27 -0.72,0.48 -0.12,0.13 -0.18,0.3 -0.25,0.46 -0.04,0.1 -0.13,0.23 -0.26,0.23z"/>
        <path class="fil0" d="M0 1.39l42.49 0 0 -0.69 -42.49 0 0 0.69z"/>
        <path class="fil0" d="M0 5.1l42.49 0 0 -0.69 -42.49 0 0 0.69z"/>
        <rect class="fil4" height="0.7" width="42.49"/>
      </svg>
  </div>
</template>
<script setup>
import {ref, computed} from 'vue'

// Constants for scaling
function mmToPixels(mm, dpi = 82, scale = .1) {
  // Пересчет миллиметров в пиксели с учетом масштаба
  return (mm * dpi * scale) / 25.4;
}

// Props
const props = defineProps({
  initialRows: {
    type: Number,
    default: 3
  },
  initialCols: {
    type: Number,
    default: 4
  },
})
// Reactive state
const rows = ref(props.initialRows)
const cols = ref(props.initialCols)
// Параметры сетки
const gridTotalWidth = ref(mmToPixels(1228))
const gridTotalHeight = ref(mmToPixels(1177 - 145))
// Вычисляемые размеры ячеек
const cellWidth = computed(() => gridTotalWidth.value / cols.value)
const cellHeight = computed(() => gridTotalHeight.value / rows.value)
// Генерация ячеек сетки
const gridCells = computed(() => {
  const cells = []
  for (let i = 0; i < rows.value; i++) {
    for (let j = 0; j < cols.value; j++) {
      cells.push({
        x: j * cellWidth.value,
        y: i * cellHeight.value
      })
    }
  }
  return cells
})
</script>
<style scoped>
.svg-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 1fr min-content;
  justify-items: center;
  aspect-ratio: auto;
}

.responsive-svg {
  width: 100%;
  border: 1px #0d6efd solid;
}
.fil4 {
  fill: #F2C366
}

.fil1 {
  fill: #AD844E;
  fill-rule: nonzero
}

.fil2 {
  fill: #C99A5B;
  fill-rule: nonzero
}

.fil0 {
  fill: #D3A55E;
  fill-rule: nonzero
}

.fil3 {
  fill: #D8B072;
  fill-rule: nonzero
}
</style>



