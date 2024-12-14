<template>
  <svg ref="pallet"
       width="100%"
       height="100%"
       viewBox="0 0 50000 14000"
  >
    <!-- Ваш поддон -->
    <g>
      <polygon class="fil0" points="4.5,13200.4 1953.4,13200.4 1953.4,12032.1 4.5,12032.1 "/>
      <path class="fil1" d="M4.5 12032.2c30,0 1948.9,0 1948.9,0l0 204.6 -1948.9 -148.5 0 -56.1z"/>
      <path class="fil2"
            d="M400.7 13200.4l1552.7 0 0 -779.4c0,0 -23.1,112.7 -486.6,445.5 -463.7,332.7 -1066.1,333.9 -1066.1,333.9z"/>
      <path class="fil3"
            d="M246.5 12977.7c-2,0 -4.1,-0.2 -6.3,-0.3 -45.6,-4.6 -65.5,-55.6 -73.9,-97.9 -34.2,-96.3 -31,-218.7 -35.8,-319.2 -4.1,-83.6 -36,-235.1 4,-311.8 17.5,-33.4 52.1,-41.5 90,-41.5 33.8,0 70.4,6.4 100.1,6.8 120.6,1.8 241.4,3.5 362.1,5.1 26.6,0.4 55.5,1.3 76.1,17.2 14.4,11.1 22.4,28 26.9,44.9 25,94.9 -48.7,188.1 -131.5,247.3 -82.7,59.5 -181.2,104.1 -241.5,183.7 -40,52.6 -59.6,116.1 -82.1,177.3 -15,40.7 -43.7,88.4 -88.1,88.4z"/>
      <polygon class="fil0" points="6117.9,13200.4 8066.8,13200.4 8066.8,12032.1 6117.9,12032.1 "/>
      <path class="fil1" d="M6117.9 12032.2c30,0 1948.9,0 1948.9,0l0 204.6 -1948.9 -148.5 0 -56.1z"/>
      <path class="fil2"
            d="M6514.1 13200.4l1552.7 0 0 -779.4c0,0 -23.2,112.7 -486.8,445.5 -463.5,332.7 -1065.9,333.9 -1065.9,333.9z"/>
      <path class="fil3"
            d="M6359.9 12977.7c-2.1,0 -4.3,-0.2 -6.5,-0.3 -45.6,-4.6 -65.5,-55.6 -73.7,-97.9 -34.2,-96.3 -31,-218.7 -36,-319.2 -4,-83.6 -35.9,-235.1 4.2,-311.8 17.5,-33.4 52,-41.5 90,-41.5 33.8,0 70.4,6.4 99.9,6.8 120.8,1.8 241.5,3.5 362.3,5.1 26.6,0.4 55.4,1.3 75.9,17.2 14.5,11.1 22.6,28 27,44.9 25.1,94.9 -48.7,188.1 -131.5,247.3 -82.8,59.5 -181.2,104.1 -241.5,183.7 -40,52.6 -59.5,116.1 -82,177.3 -15,40.7 -43.9,88.4 -88.1,88.4z"/>
      <polygon class="fil0" points="12231.1,13200.4 14180.1,13200.4 14180.1,12032.1 12231.1,12032.1 "/>
      <path class="fil1" d="M12231.1 12032.2c30.1,0 1949,0 1949,0l0 204.6 -1949 -148.5 0 -56.1z"/>
      <path class="fil2"
            d="M12627.5 13200.4l1552.6 0 0 -779.4c0,0 -23.2,112.7 -486.7,445.5 -463.6,332.7 -1065.9,333.9 -1065.9,333.9z"/>
      <path class="fil3"
            d="M12473.3 12977.7c-2.2,0 -4.3,-0.2 -6.5,-0.3 -45.6,-4.6 -65.5,-55.6 -73.7,-97.9 -34.3,-96.3 -31.2,-218.7 -36,-319.2 -4.1,-83.6 -36,-235.1 4.2,-311.8 17.3,-33.4 51.9,-41.5 89.9,-41.5 33.9,0 70.4,6.4 100,6.8 120.8,1.8 241.5,3.5 362.3,5.1 26.5,0.4 55.4,1.3 75.9,17.2 14.4,11.1 22.5,28 27,44.9 24.9,94.9 -48.8,188.1 -131.5,247.3 -82.8,59.5 -181.2,104.1 -241.5,183.7 -40.1,52.6 -59.5,116.1 -82,177.3 -15.1,40.7 -43.9,88.4 -88.1,88.4z"/>
      <polygon class="fil0" points="4.5,12032.2 14180.1,12032.2 14180.1,11765.8 4.5,11765.8 "/>
      <polygon class="fil0" points="4.5,13466.8 14180.1,13466.8 14180.1,13200.4 4.5,13200.4 "/>
    </g>
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
  {x: 0, y: 0, width: 3000, height: 3000}
])
const svgElement = useTemplateRef('pallet')
// Создаем ref для отслеживания последней позиции X
const lastX = ref(0)
const addBox = () => {
  lastX.value += 3000  // Увеличиваем X на 100 для следующей коробки
  boxes.value.push({
    x: lastX.value,
    y: 0,
    width: 3000,
    height: 3000
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

.str0 {
  stroke: #FEFEFE;
  stroke-width: 23.6;
  stroke-miterlimit: 22.9256
}

.str1 {
  stroke: #FEFEFE;
  stroke-width: 9;
  stroke-miterlimit: 22.9256
}

.fil10 {
  fill: none
}

.fil11 {
  fill: none;
  fill-rule: nonzero
}

.fil12 {
  fill: #FEFEFE
}

.fil8 {
  fill: #E32029
}

.fil5 {
  fill: #D4A65E
}

.fil9 {
  fill: #2D4278
}

.fil4 {
  fill: #D3A55E
}

.fil13 {
  fill: #FEFEFE;
  fill-rule: nonzero
}

.fil7 {
  fill: #2D4278;
  fill-rule: nonzero
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

.fil6 {
  fill: #F2C366;
  fill-rule: nonzero
}
</style>