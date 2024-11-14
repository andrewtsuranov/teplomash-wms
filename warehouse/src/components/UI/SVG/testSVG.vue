<template>
  <svg ref="pallet" width="1400" height="1400">
    <!-- Ваш поддон -->
    <rect width="1200" height="144" fill="brown"/>
    <!-- Коробки будут добавляться сюда -->
  </svg>
  <button @click="addBox">Добавить коробку</button>
  <button @click="removeBox">Удалить коробку</button>
</template>
<script setup>
import {onMounted, useTemplateRef, ref} from 'vue'
import {useUpdateBoxes} from "@/composables/UpdateBoxes.js";
// Массив с данными о коробках
const boxes = ref([
  {x: 0, y: 0, width: 100, height: 100}
])
const svgElement = useTemplateRef('pallet')
// Создаем ref для отслеживания последней позиции X
const lastX = ref(0)
const addBox = () => {
  lastX.value += 100  // Увеличиваем X на 100 для следующей коробки
  boxes.value.push({
    x: lastX.value,
    y: 0,
    width: 100,
    height: 100
  })
  useUpdateBoxes(boxes.value, svgElement.value)
}
const removeBox = () => {
  boxes.value.pop()
  useUpdateBoxes(boxes.value, svgElement.value)
}
onMounted(() => {
  useUpdateBoxes(boxes.value, svgElement.value)
})
</script>
<style>
.box {
  stroke: black;
  stroke-width: 1;
  opacity: 0.8; /* прозрачность */
  cursor: pointer; /* курсор при наведении */
}

/* Стиль при наведении мыши */
.box:hover {
  opacity: 1;
  stroke-width: 2;
  stroke: red;
}
</style>