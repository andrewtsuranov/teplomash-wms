<template>
  <div class="svg-container">
    <div class="svg-pallet">
      <svg v-for="(rect, index) in rectangles"
           :key="index"
           :viewBox="viewBoxes[index]"
           preserveAspectRatio="xMidYMid slice">
        <!-- Поддон -->
        <g :transform="palletTransform(index)">
          <rect
              :height="palletHeight"
              :width="getPalletWidth(index)"
              fill="#8B4513"
              stroke="#582C0C"
              stroke-width="1"
          />
        </g>
        <!-- Сетка коробок -->
        <g :transform="gridTransform(index)">
          <rect
              :height="gridTotalHeight"
              :width="gridWidths[index]"
              fill="#F2C366"
              stroke="#fff"
              stroke-width="2"
          />
          <!-- Исправленные линии -->
          <line
              v-for="x in calculateVerticalLines(index)"
              :key="`v-${x}`"
              :x1="x"
              :x2="x"
              :y2="gridTotalHeight"
              stroke="#fff"
              stroke-width="5"
              y1="0"
          />
          <line
              v-for="y in calculateHorizontalLines(index)"
              :key="`h-${y}`"
              :x2="gridWidths[index]"
              :y1="y"
              :y2="y"
              stroke="#fff"
              stroke-width="5"
              x1="0"
          />
        </g>
        <!-- Логотипы для второй сетки -->
        <template v-if="index === 1">
          <g
              v-for="cell in calculateCellCenters(rect)"
              :key="`logo-${cell.x}-${cell.y}`"
              :transform="`translate(${cell.x}, ${cell.y})`"
          >
            <g :transform="`scale(${logoScale})`" type="pic">
              <path class="fil0"
                    d="M1765.9 167.46c1.24,2.98 2.94,5.49 5.11,7.51 2.17,2.02 4.71,3.56 7.6,4.61 2.9,1.06 6.04,1.59 9.41,1.59 3.26,0 6.33,-0.53 9.23,-1.59 2.9,-1.05 5.44,-2.59 7.64,-4.61 2.21,-2.02 3.94,-4.53 5.21,-7.51 1.27,-2.98 1.9,-6.41 1.9,-10.27 0,-3.86 -0.62,-7.28 -1.85,-10.27 -1.24,-2.99 -2.95,-5.49 -5.12,-7.51 -2.17,-2.02 -4.72,-3.56 -7.65,-4.62 -2.92,-1.05 -6.04,-1.58 -9.36,-1.58 -3.25,0 -6.33,0.53 -9.23,1.58 -2.89,1.06 -5.44,2.6 -7.64,4.62 -2.2,2.02 -3.94,4.52 -5.2,7.51 -1.27,2.99 -1.9,6.41 -1.9,10.27 0,3.86 0.61,7.29 1.85,10.27zm5.2 -18.46c0.91,-2.32 2.17,-4.25 3.8,-5.79 1.63,-1.54 3.56,-2.7 5.79,-3.48 2.23,-0.78 4.68,-1.18 7.33,-1.18 2.53,0 4.9,0.4 7.11,1.18 2.2,0.78 4.13,1.94 5.78,3.48 1.66,1.54 2.98,3.47 3.94,5.79 0.97,2.32 1.45,5.05 1.45,8.19 0,3.2 -0.47,5.96 -1.41,8.28 -0.93,2.32 -2.21,4.25 -3.84,5.79 -1.63,1.54 -3.56,2.68 -5.79,3.44 -2.23,0.75 -4.65,1.13 -7.24,1.13 -2.47,0 -4.83,-0.39 -7.05,-1.18 -2.24,-0.78 -4.19,-1.94 -5.84,-3.48 -1.66,-1.54 -2.97,-3.47 -3.94,-5.79 -0.96,-2.32 -1.44,-5.05 -1.44,-8.19 0,-3.14 0.45,-5.87 1.35,-8.19zm7.6 19.86l4.71 0 0 -10.76 4.34 1.35 6.51 9.41 5.53 0 -6.7 -9.86 -2.54 -1.27c1.81,-0.12 3.34,-0.69 4.58,-1.71 1.23,-1.03 1.85,-2.51 1.85,-4.44 0,-2.59 -0.9,-4.42 -2.72,-5.47 -1.8,-1.06 -3.98,-1.59 -6.51,-1.59 -1.57,0 -3.23,0.08 -4.98,0.23 -1.75,0.15 -3.11,0.38 -4.07,0.68l0 23.43zm13.3 -17.1c0,1.33 -0.48,2.26 -1.45,2.81 -0.96,0.54 -2.32,0.81 -4.07,0.81l-3.07 0 0 -6.42c0.36,-0.18 0.84,-0.29 1.44,-0.32 0.61,-0.03 1.24,-0.05 1.9,-0.05 3.5,0 5.25,1.06 5.25,3.17z"/>
              <path class="fil0"
                    d="M682.67 266.93c-3.62,13.36 -9.72,23.42 -17.81,30.02 -8.09,6.59 -16.82,11.2 -26.07,13.68 -5.43,1.49 -11.04,2.64 -16.15,2.97 -5.27,0.5 -10.23,0.66 -14.68,0.66l-2.79 0.33c-23.43,-0.17 -42.06,-6.59 -56.08,-19.45 -13.85,-12.88 -20.78,-32.66 -20.78,-59.37 0,-23.1 7.09,-42.06 20.94,-56.57 14.02,-14.52 33.97,-21.77 59.36,-21.77l2.82 0c21.26,0 37.27,4.95 47.33,14.84 10.22,9.9 17.47,20.94 21.26,32.82 2.14,6.1 3.47,12.2 4.13,18.13 0.65,5.78 1.16,11.06 1.32,15.51l0.32 8.08 -110.32 0c0,1.16 0.17,2.64 0.17,3.97 0,1.31 0.32,2.79 0.66,4.27 1.16,7.27 4.28,14.19 9.23,20.29 4.94,6.26 12.71,9.57 23.08,10.06 6.61,-0.49 12.55,-2.3 17.49,-5.28 4.95,-3.14 8.41,-7.58 10.06,-13.19l2.98 0 43.53 0zm-44.36 -44.69c-0.17,-10.23 -2.15,-17.64 -5.62,-22.43 -3.3,-4.94 -7.25,-8.41 -11.37,-10.39 -2.15,-0.83 -4.3,-1.65 -6.42,-1.81 -1.99,-0.49 -3.98,-0.66 -5.46,-0.66 -9.06,0.33 -15.99,2.8 -20.61,7.09 -4.62,4.29 -8.08,9.4 -10.05,14.68 -0.99,2.31 -1.83,4.78 -2.31,7.08 -0.35,2.31 -0.83,4.63 -1,6.6l62.84 -0.16z"/>
              <path class="fil0"
                    d="M1637.06 279.75l-0.1 -116.87 46.19 45.07 -0.4 -0.3 0 72.1 43.72 0 0 -116.87 0.5 -0.31 45.71 45.38 -0.73 -0.3 0 101.42 -2.6 0 -221.91 0 0 -146.19 0.42 0 46.1 45.07 -0.72 0.1 0 71.7 43.82 0z"/>
              <path class="fil0"
                    d="M741.9 309.05l-2.98 0 -42.87 0 0 -146.11 2.8 0 140.84 0 0 146.11 -2.96 0 -42.89 0 0 -116.76 -52.11 0 0.17 116.76z"/>
              <path class="fil0"
                    d="M849.95 309.79l0 -30.35 2.79 0c0.99,0.33 2.15,0.49 3.31,0.67 0.99,0.16 1.98,0.32 2.79,0.32 10.89,-0.66 17.49,-6.26 19.81,-16.65 2.13,-10.56 3.61,-23.42 4.11,-38.43l1.32 -62.34 2.79 0 122.04 0 0 146.11 -2.8 0 -42.87 0 0 -116.75 -35.3 0 -0.65 32.82c0,1.31 -0.16,2.79 -0.16,4.11 0,1.33 -0.17,2.81 -0.17,4.13 -0.51,19.63 -3.97,37.59 -10.07,53.76 -6.1,16.16 -20.77,24.41 -44.02,24.41l-2.98 0.16c-2.96,-0.16 -6.1,-0.49 -9.39,-0.66 -3.3,-0.33 -6.93,-0.99 -10.55,-1.65l0 0.34z"/>
              <path class="fil0"
                    d="M1097.54 314.55c-19.96,-0.17 -38.1,-6.27 -54.26,-17.98 -15.99,-11.55 -24.07,-31.99 -24.07,-61.01 0,-26.55 7.41,-46.35 22.09,-59.05 14.69,-12.86 33.48,-19.29 56.08,-19.29l2.96 0c24.4,0 43.72,6.93 57.56,20.77 13.84,13.86 20.78,33.16 20.78,57.57 0,24.9 -6.94,44.35 -20.78,57.88 -13.84,13.68 -33.16,20.61 -57.56,20.61l-2.96 0.33 0.16 0.17zm1.48 -29.53c11.72,-0.33 19.97,-4.61 24.24,-12.69 4.46,-8.09 7.1,-17.15 7.77,-26.88 0,-1.65 0.16,-3.47 0.16,-5.11 0.16,-1.65 0.16,-3.3 0.16,-4.78 0,-16.66 -2.47,-28.37 -7.26,-35.14 -4.94,-6.6 -10.39,-10.89 -16.33,-12.53 -1.48,-0.49 -3.12,-0.82 -4.6,-0.82 -1.48,-0.33 -2.98,-0.33 -4.3,-0.33 -9.57,0.16 -16.66,3.13 -21.1,8.9 -4.46,5.61 -7.76,12.04 -9.41,18.97 -0.83,3.79 -1.31,7.59 -1.65,11.38 -0.17,3.63 -0.33,6.93 -0.33,9.57 0,2.8 0,5.94 0.33,9.56 0.18,3.63 0.82,7.42 1.65,11.21 1.48,7.09 4.63,13.53 9.07,19.3 4.45,5.93 11.71,9.06 21.44,9.56l0.16 -0.17z"/>
              <path class="fil0"
                    d="M1231.6 215.65l0 0.33 0 93.18 -2.98 0 -42.87 0 0 -146.11 2.8 0 57.05 0 37.78 99.27 37.6 -99.27 2.96 0 56.73 0 0 146.11 -2.64 0 -42.86 0 0 -93.18 0 -0.33 -36.28 93.51 -2.98 0 -28.36 0 -35.95 -93.51z"/>
              <path class="fil0"
                    d="M1395.32 209.79c0,-1.15 0,-2.63 0.33,-4.12 0.16,-1.49 0.32,-2.97 0.5,-4.29 1.97,-11.21 7.58,-21.27 16.99,-30.51 9.55,-9.06 26.04,-13.68 49.45,-13.68l2.99 0c20.1,0 34.8,3.13 43.69,9.23 8.92,6.1 15.02,13.03 18.14,20.29 1.66,3.95 2.8,7.91 3.14,11.53 0.33,3.8 0.49,7.1 0.49,9.9l0 1.99 0 1.8 -0.49 66.8 0 3.46 0 3.14c0,5.6 0.49,10.22 1.48,14.01 1,3.63 3.31,6.1 6.75,6.93l0 2.64 -2.8 0 -45.17 0 -3.14 -12.7c-2.64,3.13 -5.6,5.76 -8.58,7.75 -3.12,1.98 -6.26,3.79 -9.24,4.95 -6.1,2.47 -12.04,4.12 -17.47,4.45 -5.45,0.49 -9.08,0.65 -11.05,0.65l-2.79 0.34c-15.67,-0.16 -26.9,-2.97 -33.83,-8.57 -7.08,-5.62 -11.7,-12.04 -14.01,-18.98 -0.66,-2.63 -1.31,-5.27 -1.48,-7.74 -0.34,-2.48 -0.66,-4.78 -0.66,-6.93 0,-16.49 5.77,-27.87 17.14,-34.13 11.39,-6.11 26.55,-10.56 45.04,-12.87 3.46,-0.17 6.42,-0.66 8.9,-0.82 2.79,-0.34 5.26,-0.83 7.25,-1 7.26,-0.98 12.2,-2.3 14.68,-3.95 2.47,-1.65 3.95,-4.78 4.11,-9.4l0 -1 0 -0.98 0 -0.99 0 -0.99c0,-0.83 -0.16,-2.14 -0.33,-3.8 -0.16,-1.64 -0.81,-3.79 -1.96,-5.76 -1.15,-2.31 -3.3,-4.46 -6.26,-6.44 -3.14,-1.98 -7.6,-3.13 -13.38,-3.29 -1.32,0 -2.96,0.16 -4.95,0.32 -1.8,0.33 -3.79,0.82 -5.94,1.66 -3.44,1.15 -6.58,3.29 -9.56,6.59 -2.8,3.13 -4.28,8.24 -4.28,14.68l-2.79 0 -40.91 -0.17zm90.7 30.67c-2.31,0.83 -4.29,1.66 -5.77,2.32 -1.32,0.49 -2.64,1.15 -3.79,1.32 -0.83,0.32 -1.48,0.48 -2.15,0.48 -0.67,0.18 -1.32,0.34 -1.81,0.5 -1.66,0.16 -3.3,0.5 -5.12,0.66 -1.8,0.33 -4.12,0.82 -7.08,1.33 -1.17,0.16 -2.98,0.49 -4.78,0.82 -1.98,0.49 -4.14,0.99 -6.1,1.81 -3.63,1.32 -6.93,3.47 -9.73,6.1 -2.98,2.81 -4.46,6.93 -4.46,12.37 0,5.28 1.81,9.24 5.27,11.71 3.63,2.47 7.58,4.12 11.72,4.95l1.8 0c0.51,0.17 1.16,0.33 1.82,0.33 1.65,-0.33 3.63,-0.66 5.94,-1.16 2.32,-0.66 4.62,-1.65 7.1,-2.96 4.28,-2.31 8.06,-5.94 11.69,-11.05 3.47,-5.11 5.29,-12.37 5.29,-21.44l0.16 -8.09z"/>
              <path class="fil0"
                    d="M407 139.27l0 -39.06 2.9 0 165.75 0 0 39.16 -59.36 0 0 162.25 -0.31 0 -49.11 -51.39 0 0.42 0 -111.28 -59.87 -0.1z"/>
              <path class="fil1"
                    d="M76.62 250.16l-51.08 0 0 -153.34 -25.54 0 25.54 -48.41 25.54 -48.41 25.54 48.41 25.54 48.41 -25.54 0 0 153.34z"/>
              <path class="fil2"
                    d="M127.7 96.82l-51.08 0 0 153.34 -25.54 0 25.54 48.41 25.54 48.41 25.54 -48.41 25.54 -48.41 -25.54 0 0 -153.34z"/>
              <path class="fil1"
                    d="M178.78 250.16l-51.08 0 0 -153.34 -25.54 0 25.54 -48.41 25.54 -48.41 25.54 48.41 25.53 48.41 -25.53 0 0 153.34z"/>
              <path class="fil2"
                    d="M229.85 96.82l-51.07 0 0 153.34 -25.54 0 25.54 48.41 25.53 48.41 25.54 -48.41 25.54 -48.41 -25.54 0 0 -153.34z"/>
              <path class="fil1"
                    d="M280.93 250.16l-51.08 0 0 -153.34 -25.54 0 25.54 -48.41 25.54 -48.41 25.54 48.41 25.54 48.41 -25.54 0 0 153.34z"/>
              <path class="fil2"
                    d="M332.01 96.82l-51.08 0 0 153.34 -25.54 0 25.54 48.41 25.54 48.41 25.54 -48.41 25.54 -48.41 -25.54 0 0 -153.34z"/>
            </g>
          </g>
        </template>
        <!-- Высота -->
        <g v-if="index === 0" class="dimension-line">
          <line
              :y1="rect.height + palletHeight"
              stroke="#ffebcd"
              stroke-width="3"
              x1="-70"
              x2="-70"
              y1="0"
          />
          <!-- Стрелки -->
          <path d="M -85 50 L -70 0 L -55 50"
                fill="#ffebcd"
                stroke="#ffebcd"
          />
          <path
              :d="`M -85 ${rect.height + palletHeight - 50} L -70 ${rect.height + palletHeight} L -55 ${rect.height + palletHeight - 50}`"
              fill="#ffebcd"
              stroke="#ffebcd"
          />
          <!-- Текст высоты над линией -->
          <text
              :x="-rect.height / 2"
              :y="-100"
              class="dimension-text"
              text-anchor="middle"
              transform="rotate(-90)"
          >
            {{ getTotalHeight(rect) }} мм
          </text>
        </g>
        <!-- Ширина -->
        <g class="dimension-line">
          <line
              :x2="getMaxWidth(index)"
              :y1="rect.height + palletHeight + 150"
              :y2="rect.height + palletHeight + 150"
              stroke="#ffebcd"
              stroke-width="3"
              x1="0"
          />
          <!-- Стрелки -->
          <path
              :d="`M 50 ${rect.height + palletHeight + 135} L 0 ${rect.height + palletHeight + 150} L 50 ${rect.height + palletHeight + 165}`"
              fill="#ffebcd"
              stroke="#ffebcd"
          />
          <path
              :d="`M ${getMaxWidth(index) -50} ${rect.height + palletHeight + 135} L ${getMaxWidth(index)} ${rect.height + palletHeight + 150} L ${getMaxWidth(index)-50} ${rect.height + palletHeight + 165}`"
              fill="#ffebcd"
              stroke="#ffebcd"
          />
          <!-- Текст ширины -->
          <text
              :x="getMaxWidth(index) / 2"
              :y="rect.height + palletHeight + 110"
              class="dimension-text"
              text-anchor="middle"
          >
            {{ getMaxWidth(index) }} мм
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>
<script setup>
import {computed, ref, watchEffect} from 'vue'
import {useERPStore} from "@/stores/HTTP/ERPStore.js"

const ERPStore = useERPStore()
// Размеры поддона
const palletHeight = ref(145) // Высота поддона
const palletStandardWidth = ref(800) // Стандартная ширина поддона
const palletWideWidth = ref(1200) // Широкий поддон
const palletLength = ref(1200) // Длина поддона всегда 1200
// Существующие refs из исходного кода
const boxLength = ref(null)
const boxWidth = ref(null)
const boxHeight = ref(null)
const matrixLength = ref(null)
const matrixWidth = ref(null)
const matrixHeight = ref(null)
const gridTotalWidth = ref(null)
const gridTotalHeight = ref(null)
const gridTotalLength = ref(null)
const logoScale = computed(() => gridTotalWidth.value * 0.00023)
const rectangles = ref([])
// Получаем ширину поддона в зависимости от вида
const getPalletWidth = (index) => {
  // Для вида спереди используем актуальную ширину поддона
  if (index === 0) {
    return palletLength.value
  }
  // Для вида сбоку всегда возвращаем длину 1200
    return ERPStore.getBasePallet.width === 1200 ? palletWideWidth.value : palletStandardWidth.value

}
// Новые реактивные вычисления для габаритов
const getMaxWidth = (index) => {
  const gridWidth = index === 0 ? gridTotalWidth.value : gridTotalLength.value
  const palletWidth = getPalletWidth(index)
  return Math.max(gridWidth, palletWidth)
}
const getTotalHeight = (rect) => {
  return rect.height + palletHeight.value
}
watchEffect(() => {
  // Обновляем значения при изменении в ERPStore
  boxLength.value = ERPStore.productTypeId.length
  boxWidth.value = ERPStore.productTypeId.width
  boxHeight.value = ERPStore.productTypeId.height
  matrixLength.value = ERPStore.palletTypeId.rows_length
  matrixWidth.value = ERPStore.palletTypeId.rows_width
  matrixHeight.value = ERPStore.palletTypeId.rows_height
  // Пересчитываем общие размеры
  gridTotalLength.value = boxLength.value * matrixLength.value
  gridTotalWidth.value = boxWidth.value * matrixWidth.value
  gridTotalHeight.value = boxHeight.value * matrixHeight.value
  // Обновляем rectangles с учетом центрирования по поддону
  rectangles.value = [
    {
      width: getMaxWidth(0),
      height: gridTotalHeight.value,
      rowCount: ERPStore.palletTypeId.rows_height,
      colCount: ERPStore.palletTypeId.rows_width
    },
    {
      width: getMaxWidth(1),
      height: gridTotalHeight.value,
      rowCount: ERPStore.palletTypeId.rows_height,
      colCount: ERPStore.palletTypeId.rows_length
    }
  ]
})
// Исправленные функции расчета линий
const calculateVerticalLines = (index) => {
  const cols = index === 0 ? matrixWidth.value : matrixLength.value
  const cellWidth = gridWidths.value[index] / cols
  return Array.from({length: cols - 1}, (_, i) => (i + 1) * cellWidth)
}
const calculateHorizontalLines = (index) => {
  const cellHeight = gridTotalHeight.value / matrixHeight.value
  return Array.from({length: matrixHeight.value - 1}, (_, i) => (i + 1) * cellHeight)
}
const gridWidths = computed(() => [
  boxWidth.value * matrixWidth.value,
  boxLength.value * matrixLength.value
])
const viewBoxes = computed(() => {
  return rectangles.value.map((_, index) => {
    const totalWidth = Math.max(gridWidths.value[index], getPalletWidth(index)) + 200
    const totalHeight = gridTotalHeight.value + palletHeight.value + 200
    return `-200 0 ${totalWidth} ${totalHeight}`
  })
})
const palletTransform = (index) => {
  const x = (Math.max(gridWidths.value[index], getPalletWidth(index)) - getPalletWidth(index)) / 2
  return `translate(${x}, ${gridTotalHeight.value})`
}
const gridTransform = (index) => {
  const x = (Math.max(gridWidths.value[index], getPalletWidth(index)) - gridWidths.value[index]) / 2
  return `translate(${x}, 0)`
}

function calculateCellCenters(rect) {
  const cellWidth = rect.width / rect.colCount
  const cellHeight = rect.height / rect.rowCount
  const centers = []
  for (let row = 0; row < rect.rowCount; row++) {
    for (let col = 0; col < rect.colCount; col++) {
      const logoCurrentWidth = 1812 * logoScale.value
      const logoCurrentHeight = 346.98 * logoScale.value
      centers.push({
        x: cellWidth * (col + 0.5) - (logoCurrentWidth / 2),
        y: cellHeight * (row + 0.5) - (logoCurrentHeight / 2)
      })
    }
  }
  return centers
}
</script>
<style scoped>
.svg-container {
  aspect-ratio: auto;
}

.svg-pallet {
  display: flex;
  gap: 2rem;
}


.svg-pallet svg {
  height: 300px;

}


.dimension-text {
  font-family: 'Arial', sans-serif;
  font-size: 5rem;
  fill: blanchedalmond;
}


.fil1 {
  fill: #E32029
}

.fil2 {
  fill: #2D4278
}

.fil0 {
  fill: #2D4278;
  fill-rule: nonzero
}
</style>