<!--<template>-->
<!--  <div>-->
<!--    <h1>Here's gonna be About Info</h1>-->
<!--  </div>-->
<!--</template>-->
<!--<script setup>-->
<!--</script>-->
<!--<style scoped>-->
<!--</style>-->

<template>
  <div class="warehouse-map">
    <svg :width="svgWidth" :height="svgHeight" @click="handleCellClick">
      <g v-for="row in rows" :key="row" :transform="`translate(0, ${(row - 1) * (floorHeight + rowGap)})`">
        <text
            :x="-50"
            :y="floorHeight / 2"
            text-anchor="end"
            dominant-baseline="middle"
            font-size="14"
            font-weight="bold"
        >
          Ряд {{ row }}
        </text>
        <g v-for="floor in floors" :key="floor" :transform="`translate(0, ${(floor - 1) * (cellHeight + gap)})`">
          <g v-for="cell in cells" :key="cell" :transform="`translate(${(cell - 1) * (cellWidth + gap)}, 0)`">
            <rect
                :x="0"
                :y="0"
                :width="cellWidth"
                :height="cellHeight"
                :class="{ occupied: isOccupied(row, cell, floor) }"
                :data-row="row"
                :data-cell="cell"
                :data-floor="floor"
            />
            <text
                :x="cellWidth / 2"
                :y="cellHeight / 2"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="10"
            >
              {{ `${cell}-${floor}` }}
            </text>
          </g>
        </g>
      </g>
    </svg>
    <div v-if="selectedCell" class="cell-info">
      <h3>Ячейка: {{ selectedCell.row }}-{{ selectedCell.cell }}-{{ selectedCell.floor }}</h3>
      <p>Содержимое: {{ selectedCell.content || 'Пусто' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Константы для размеров SVG
const cellWidth = 50; // Ширина ячейки
const cellHeight = 30; // Высота ячейки
const gap = 5; // Расстояние между ячейками внутри ряда
const rowGap = 40; // Увеличенный отступ между рядами
const rows = 32; // Количество рядов
const cells = 11; // Количество ячеек в ряду
const floors = 7; // Количество этажей
const floorHeight = floors * (cellHeight + gap); // Высота одного ряда (все этажи)
const svgWidth = cells * (cellWidth + gap); // Ширина SVG (ширина одного ряда)
const svgHeight = rows * (floorHeight + rowGap); // Общая высота SVG с учётом отступов между рядами

// Пример данных о содержимом ячеек
const warehouseData = ref({
  '1-1-1': { content: 'Коробка с деталями' },
  '2-5-3': { content: 'Паллета с товаром' },
  '32-11-7': { content: 'Ящик с инструментами' },
});

// Выбранная ячейка
const selectedCell = ref(null);

// Проверка, занята ли ячейка
const isOccupied = (row, cell, floor) => {
  const cellId = `${row}-${cell}-${floor}`;
  return !!warehouseData.value[cellId];
};

// Обработка клика по ячейке
const handleCellClick = (event) => {
  const target = event.target;
  if (target.tagName === 'rect') {
    const row = target.dataset.row;
    const cell = target.dataset.cell;
    const floor = target.dataset.floor;
    const cellId = `${row}-${cell}-${floor}`;
    selectedCell.value = {
      row,
      cell,
      floor,
      content: warehouseData.value[cellId]?.content || null,
    };
  }
};
</script>

<style scoped>
.warehouse-map {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

svg {
  border: 1px solid #ccc;
}

rect {
  fill: #e0e0e0;
  stroke: #999;
  stroke-width: 1;
}

rect.occupied {
  fill: #ffcccb; /* Цвет для занятых ячеек */
}

rect:hover {
  fill: #d0d0d0;
  cursor: pointer;
}

text {
  pointer-events: none; /* Текст не мешает кликам */
}

.cell-info {
  padding: 10px;
  border: 1px solid #ccc;
  background: #f9f9f9;
}
</style>