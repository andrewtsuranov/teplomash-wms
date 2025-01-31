# PalletWithBoxes.vue
<template>
  <div class="w-full">
    <div class="bg-gray-100 p-4 mb-4 rounded">
      <p>Размеры поддона: {{ palletLength }}x{{ palletHeight }}мм</p>
      <p>Размеры коробки: {{ boxLength }}x{{ boxWidth }}мм</p>
      <p>Коробок на поддоне: {{ totalBoxes }}</p>
      <p>Матрица: {{ matrixRows }}x{{ matrixCols }}</p>
    </div>

    <svg
        width="324.57"
        height="38.95"
        viewBox="0 0 324.57 38.95"
        preserveAspectRatio="xMidYMid meet"
        :style="svgStyle"
    >
      <!-- Поддон (уменьшен в 4 раза) -->
      <g id="_1943552666592" transform="scale(0.25, 0.25)">
        <path class="fil0" d="M-0 134.76l178.49 0 0 -92.24 -178.49 0 0 92.24z"/>
        <path class="fil1" d="M-0 42.52c2.75,0 178.5,0 178.5,0l0 16.16 -178.5 -11.73 0 -4.43z"/>
        <path class="fil2" d="M36.29 134.76l142.21 0 0 -61.54c0,0 -2.12,8.89 -44.57,35.17 -42.46,26.28 -97.63,26.37 -97.63,26.37z"/>
        <path class="fil0" d="M559.9 134.76l178.49 0 0 -92.24 -178.49 0 0 92.24z"/>
        <path class="fil1" d="M559.9 42.52c2.75,0 178.49,0 178.49,0l0 16.16 -178.49 -11.73 0 -4.43z"/>
        <path class="fil2" d="M596.19 134.76l142.2 0 0 -61.54c0,0 -2.12,8.89 -44.59,35.17 -42.45,26.28 -97.62,26.37 -97.62,26.37z"/>
        <path class="fil0" d="M1119.79 134.76l178.5 0 0 -92.24 -178.5 0 0 92.24z"/>
        <path class="fil1" d="M1119.79 42.52c2.75,0 178.49,0 178.49,0l0 16.16 -178.49 -11.73 0 -4.43z"/>
        <path class="fil2" d="M1156.09 134.76l142.19 0 0 -61.54c0,0 -2.12,8.89 -44.57,35.17 -42.46,26.28 -97.62,26.37 -97.62,26.37z"/>
        <path class="fil0" d="M-0 42.52l1298.28 0 0 -21.03 -1298.28 0 0 21.03z"/>
        <path class="fil0" d="M-0 155.79l1298.28 0 0 -21.03 -1298.28 0 0 21.03z"/>
      </g>
      <rect class="fil4" x="0.01" y="0" width="1298.28" height="21.48" transform="scale(0.25)"/>

      <!-- Сетка и коробки -->
      <g transform="scale(0.25)">
        <!-- Сетка -->
        <g class="grid-lines">
          <line
              v-for="(line, index) in gridLines"
              :key="line.key"
              :x1="line.x1"
              :y1="line.y1"
              :x2="line.x2"
              :y2="line.y2"
              stroke="#333"
              stroke-width="1"
              stroke-dasharray="5,5"
          />
        </g>

        <!-- Коробки -->
        <g class="boxes">
          <template v-for="box in boxes" :key="box.key">
            <rect
                :x="box.x"
                :y="box.y"
                :width="boxSizeInSVG.width"
                :height="boxSizeInSVG.height"
                fill="#ADD8E6"
                stroke="#4169E1"
                stroke-width="2"
                fill-opacity="0.6"
            />
            <text
                :x="box.x + boxSizeInSVG.width/2"
                :y="box.y + boxSizeInSVG.height/2"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#000"
                font-size="3"
            >
              {{ `${boxLength}x${boxWidth}` }}
            </text>
          </template>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  palletLength: { type: Number, default: 1200 },
  palletHeight: { type: Number, default: 145 },
  boxLength: { type: Number, default: 400 },
  boxWidth: { type: Number, default: 300 },
  totalBoxes: { type: Number, default: 6 }
});

// Константы SVG (уменьшены в 4 раза)
const SVG_BASE_WIDTH = 1298.29 / 4;
const SVG_BASE_HEIGHT = 155.79 / 4;

// Стили SVG
const svgStyle = {
  shapeRendering: 'geometricPrecision',
  textRendering: 'geometricPrecision',
  imageRendering: 'optimizeQuality',
  fillRule: 'evenodd',
  clipRule: 'evenodd'
};

// Масштабирование мм в SVG единицы (с учетом уменьшения в 4 раза и корректировки для высоты)
const mmToSVGX = (1298.29 / 1200) * 0.25; // Соотношение для горизонтальных размеров
const mmToSVGY = ((155.79 - 21.48) / (145 - 20)) * 0.25; // Соотношение для вертикальных размеров с учетом полезной высоты

// Размеры коробки в единицах SVG
const boxSizeInSVG = computed(() => ({
  width: props.boxLength * mmToSVGX,
  height: props.boxWidth * mmToSVGY
}));

// Расчет оптимальной матрицы для размещения коробок
const matrixDimensions = computed(() => {
  const totalBoxes = props.totalBoxes;
  // Расчет максимального количества коробок
  const maxCols = Math.floor(props.palletLength / props.boxLength);
  const maxRows = Math.floor((props.palletHeight - 20) / props.boxWidth); // Вычитаем высоту края поддона


  // Находим оптимальное количество строк и столбцов
  let bestRows = 1;
  let bestCols = totalBoxes;

  for (let rows = 1; rows <= maxRows; rows++) {
    const cols = Math.ceil(totalBoxes / rows);
    if (cols <= maxCols && cols * rows >= totalBoxes) {
      bestRows = rows;
      bestCols = cols;
      if (cols * rows - totalBoxes <= 1) break; // Достаточно хорошее решение
    }
  }

  return {
    rows: bestRows,
    cols: bestCols
  };
});

// Экспортируем размеры матрицы для отображения
const matrixRows = computed(() => matrixDimensions.value.rows);
const matrixCols = computed(() => matrixDimensions.value.cols);

// Позиционирование сетки (центрирование на поддоне)
const gridStartX = computed(() => (SVG_BASE_WIDTH - (boxSizeInSVG.value.width * matrixCols.value)) / 2);
const gridStartY = computed(() => 5.37 + ((38.95 - 5.37 - (boxSizeInSVG.value.height * matrixRows.value)) / 2));

// Генерация линий сетки
const gridLines = computed(() => {
  const lines = [];
  const { rows, cols } = matrixDimensions.value;

  // Вертикальные линии
  for (let i = 0; i <= cols; i++) {
    lines.push({
      key: `v-${i}`,
      x1: gridStartX.value + (i * boxSizeInSVG.value.width),
      y1: gridStartY.value,
      x2: gridStartX.value + (i * boxSizeInSVG.value.width),
      y2: gridStartY.value + (rows * boxSizeInSVG.value.height)
    });
  }

  // Горизонтальные линии
  for (let i = 0; i <= rows; i++) {
    lines.push({
      key: `h-${i}`,
      x1: gridStartX.value,
      y1: gridStartY.value + (i * boxSizeInSVG.value.height),
      x2: gridStartX.value + (cols * boxSizeInSVG.value.width),
      y2: gridStartY.value + (i * boxSizeInSVG.value.height)
    });
  }

  return lines;
});

// Генерация коробок
const boxes = computed(() => {
  const result = [];
  const { rows, cols } = matrixDimensions.value;
  let boxCount = 0;

  for (let row = 0; row < rows && boxCount < props.totalBoxes; row++) {
    for (let col = 0; col < cols && boxCount < props.totalBoxes; col++) {
      result.push({
        key: `box-${row}-${col}`,
        x: gridStartX.value + (col * boxSizeInSVG.value.width),
        y: gridStartY.value + (row * boxSizeInSVG.value.height)
      });
      boxCount++;
    }
  }

  return result;
});
</script>

<style scoped>
:deep(.fil0) { fill: #D3A55E; fill-rule: nonzero; }
:deep(.fil1) { fill: #AD844E; fill-rule: nonzero; }
:deep(.fil2) { fill: #C99A5B; fill-rule: nonzero; }
:deep(.fil3) { fill: #D8B072; fill-rule: nonzero; }
:deep(.fil4) { fill: #F2C366; }
</style>